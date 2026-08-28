import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { RiAddLine } from '@remixicon/react'

interface MembersHeaderProps {
  activeCount: number
  inactiveCount: number
  totalCount: number
  onNew: () => void
}

export function MembersHeader({
  activeCount,
  inactiveCount,
  totalCount,
  onNew,
}: MembersHeaderProps) {
  return (
    <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Directorio de socios
            </h1>
            <p className="max-w-2xl text-sm sm:text-base">
              Gestiona los socios. Podes agregar, editar o eliminar socios según sea necesario.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
              Socios activos: {activeCount}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
              Socios inactivos: {inactiveCount}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
              Total: {totalCount}
            </Badge>
          </div>
        </div>

        <Button
          size="default"
          className="w-full md:w-auto md:px-5"
          onClick={onNew}
        >
          <RiAddLine className="mr-1 size-3.5" aria-hidden="true" />
          Nuevo Socio
        </Button>
      </div>
    </section>
  )
}

export default MembersHeader
