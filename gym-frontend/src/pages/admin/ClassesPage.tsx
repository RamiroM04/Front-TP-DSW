import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import ClassesDataTable from "@/components/ClassesDataTable"
import { mockClasses } from "@/services/mockClasses"
import { mockInstructors } from "@/services/mockInstructors"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RiAddLine } from "@remixicon/react"
import type { ClassSchedule } from "@/models/ClassSchedule"

export default function ClassesPage() {
  const navigate = useNavigate()
  // Se re-lee mockClasses cada vez que este componente se monta —
  // por eso, al volver de crear/editar, ya trae los cambios.
  const [classes, setClasses] = useState<ClassSchedule[]>(mockClasses)
  const instructors = mockInstructors

  // Navega a la pantalla de edición, llevándose los datos de la clase por "state".
  function handleEditar(item: ClassSchedule) {
    navigate(`/administrativo/clases/${item.id}/editar`, { state: item })
  }

  // Elimina una clase (del estado local Y de mockClasses, para mantenerlos sincronizados).
  function handleEliminar(id: string) {
    const index = mockClasses.findIndex((c) => c.id === id)
    if (index !== -1) mockClasses.splice(index, 1)
    setClasses((prev) => prev.filter((c) => c.id !== id))
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

          <Button size="default" className="w-full md:w-auto md:px-5" asChild>
            <Link to="/administrativo/clases/nueva">
              <RiAddLine className="mr-1 size-3.5" aria-hidden="true" />
              Nueva Clase
            </Link>
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
    </div>
  )
}