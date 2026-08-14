import { useState } from "react"
import ClassesDataTable from "@/components/ClassesDataTable"
import ClassScheduleFormDialog from "@/components/admin/ClassScheduleFormDialog"
import { mockClasses } from "@/services/mockClasses"
import { mockInstructors } from "@/services/mockInstructors"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RiAddLine } from "@remixicon/react"
import type { ClassSchedule } from "@/models/ClassSchedule"

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassSchedule[]>(mockClasses)
  const instructors = mockInstructors
  const [dialogOpen, setDialogOpen] = useState(false)
  const [classToEdit, setClassToEdit] = useState<ClassSchedule | null>(null)

  // Abre el diálogo en modo "crear" (sin clase precargada).
  function handleNueva() {
    setClassToEdit(null)
    setDialogOpen(true)
  }

  // Abre el diálogo en modo "editar", con la clase elegida precargada.
  function handleEditar(item: ClassSchedule) {
    setClassToEdit(item)
    setDialogOpen(true)
  }

  // Elimina una clase del estado en memoria.
  function handleEliminar(id: string) {
    setClasses((prev) => prev.filter((c) => c.id !== id))
  }

  // Crea una clase nueva o actualiza una existente, según si vino un id.
  function handleGuardar(datos: Omit<ClassSchedule, "id">, id?: string) {
    if (id) {
      setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...datos } : c)))
    } else {
      const nueva: ClassSchedule = { ...datos, id: crypto.randomUUID() }
      setClasses((prev) => [...prev, nueva])
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Clases</h1>
              <p className="max-w-2xl text-sm sm:text-base">
                Gestioná las clases recurrentes del gimnasio. Podés agregar, editar o eliminar clases según sea necesario.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                Total clases: {classes.length}
              </Badge>
            </div>
          </div>

          <Button size="default" className="w-full md:w-auto md:px-5" onClick={handleNueva}>
            <RiAddLine className="mr-1 size-3.5" aria-hidden="true" />
            Nueva Clase
          </Button>
        </div>
      </section>

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <ClassesDataTable
          classes={classes}
          instructors={instructors}
          onEdit={handleEditar}
          onDelete={handleEliminar}
        />
      </div>

      <ClassScheduleFormDialog
        key={classToEdit?.id ?? "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        classToEdit={classToEdit}
        onSave={handleGuardar}
      />
    </div>
  )
}