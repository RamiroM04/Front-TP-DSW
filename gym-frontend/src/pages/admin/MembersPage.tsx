import MembersDataTable from "@/components/MembersDataTable"
import { mockMembers } from "@/services/mockMembers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RiAddLine } from "@remixicon/react"
import { Link } from "react-router-dom"

export default function MembersPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Directorio de Socios
              </h1>
              <p className="max-w-2xl text-sm sm:text-base">
                Gestiona los socios y sus planes. Podes agregar, editar o eliminar socios según sea necesario.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                Socios activos: 142
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                Planes vencidos: 8
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                Nuevas inscripciones este mes: +24
              </Badge>
            </div>
          </div>

          <Button size="default" className="w-full md:w-auto md:px-5" asChild>
            <Link to="/administrativo/socios/nuevo">
              <RiAddLine className="mr-1 size-3.5" aria-hidden="true" />
              Nuevo Socio
            </Link>
          </Button>
        </div>
      </section>

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <MembersDataTable title="Listado de Socios" subtitle="Socios registrados en el sistema" initialData={mockMembers} />
      </div>
    </div>
  )
}
