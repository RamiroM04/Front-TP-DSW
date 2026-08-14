import { useState } from "react"
import PlansDataTable from "@/components/admin/PlansDataTable"
import PlanFormDialog from "@/components/admin/PlanFormDialog"
import { mockPlans } from "@/services/mockPlans"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RiAddLine } from "@remixicon/react"
import type { Plan } from "@/models/Plan"

export default function PlansPage() {
  // Estado en memoria: hace de "base de datos" mientras no está conectado al backend.
  const [plans, setPlans] = useState<Plan[]>(mockPlans)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null)

  // Abre la ventana emergente(Modal) en modo "crear" (sin plan precargado).
  function handleNew() {
    setPlanToEdit(null)
    setDialogOpen(true)
  }

  // Abre la ventana emergente(Modal) en modo "editar", con el plan elegido precargado.
  function handleEdit(plan: Plan) {
    setPlanToEdit(plan)
    setDialogOpen(true)
  }

  // Elimina un plan del estado en memoria.
  function handleDelete(id: string) {
    setPlans((prev) => prev.filter((p) => p.id !== id))
  }

  // Crea un plan nuevo o actualiza uno existente, según si vino un id.
  function handleSave(datos: Omit<Plan, "id">, id?: string) {
    if (id) {
      setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...datos } : p)))
    } else {
      const nuevo: Plan = { ...datos, id: crypto.randomUUID() }
      setPlans((prev) => [...prev, nuevo])
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Planes de Membresía</h1>
              <p className="max-w-2xl text-sm sm:text-base">
                Gestioná los planes disponibles. Podés agregar, editar o eliminar planes según sea necesario.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                Total planes: {plans.length}
              </Badge>
            </div>
          </div>

          <Button size="default" className="w-full md:w-auto md:px-5" onClick={handleNew}>
            <RiAddLine className="mr-1 size-3.5" aria-hidden="true" />
            Nuevo Plan
          </Button>
        </div>
      </section>

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <PlansDataTable
          plans={plans}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Listado de Planes"
          subtitle="Planes registrados en el sistema"
        />
      </div>

      <PlanFormDialog
        key={`${planToEdit?.id ?? "new"}-${dialogOpen ? "open" : "closed"}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        planToEdit={planToEdit}
        onSave={handleSave}
      />
    </div>
  )
}