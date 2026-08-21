import { useState, useEffect } from "react"
import PlansDataTable from "@/components/admin/PlansDataTable"
import PlanFormDialog from "@/components/admin/MembershipPlanFormDialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import type { MembershipPlan, CreateMembershipPlanInput } from "@/models/MembershipPlan"
import { membershipPlanService } from "@/services/membershipPlanService"

export default function MembershipPlansPage() {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [planToEdit, setPlanToEdit] = useState<MembershipPlan | null>(null)

  useEffect(() => {
    async function loadMembershipPlans() {
      try {
        const data = await membershipPlanService.getAll()
        setMembershipPlans(data)
      } catch (error) {
        toast.error("Error al cargar los planes de membresía")
      } finally {
        setLoading(false)
      }
    }
    loadMembershipPlans()
  }, [])

  // Abre la ventana emergente(Modal) en modo "crear" (sin plan precargado).
  function handleNew() {
    setPlanToEdit(null)
    setDialogOpen(true)
  }

  // Abre la ventana emergente(Modal) en modo "editar", con el plan elegido precargado.
  function handleEdit(plan: MembershipPlan) {
    setPlanToEdit(plan)
    setDialogOpen(true)
  }

  // Elimina un plan del estado en memoria.
  async function handleDelete(id: number) {
    try {
      await membershipPlanService.delete(id)
      setMembershipPlans((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      toast.error("Error al eliminar el plan de membresía")
    }
  }

  // Crea un plan nuevo o actualiza uno existente, según si vino un id.
  async function handleSave(data: CreateMembershipPlanInput, id?: number) {
    try {
      if (id !== undefined) {
        const updatedPlan = await membershipPlanService.update(id, data)
        setMembershipPlans((prev) =>
          prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
        )
        toast.success("Plan de membresía actualizado correctamente")
        return
      }

      const newPlan = await membershipPlanService.create(data as CreateMembershipPlanInput)
      setMembershipPlans((prev) => [...prev, newPlan])
      toast.success("Plan de membresía creado correctamente")
    } catch (error) {
      toast.error("Error al guardar el plan de membresía")
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
                Total planes: {membershipPlans.length}
              </Badge>
            </div>
          </div>

          <Button size="default" className="w-full md:w-auto md:px-5" onClick={handleNew}>
            <Plus className="mr-1 size-3.5" aria-hidden="true" />
            Nuevo Plan
          </Button>
        </div>
      </section>

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <PlansDataTable
          plans={membershipPlans}
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