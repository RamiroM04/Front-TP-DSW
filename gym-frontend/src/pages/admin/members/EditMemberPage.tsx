import { useNavigate } from 'react-router-dom'
import BreadCrumb from '@/shared/components/BreadCrumb'
import { Button } from '@/shared/components/ui/button'
import MemberForm from '@/features/members/components/MemberForm'
import { useEditMember } from '@/features/members/hooks/useEditMember'

export default function EditMemberPage() {
  const navigate = useNavigate()
  const { id, member, loading, handleSubmit } = useEditMember()

  if (loading) {
    return (
      <div className="space-y-4">
        <BreadCrumb
          crumbs={[
            { label: 'Socios', href: '/administrativo/socios' },
            { label: 'Editar Socio' },
          ]}
        />
        <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Editar Socio
          </h1>
        </section>
        <div className="rounded-xl border bg-background px-4 py-6 sm:px-6 text-center">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="space-y-4">
        <BreadCrumb
          crumbs={[
            { label: 'Socios', href: '/administrativo/socios' },
            { label: 'Editar Socio' },
          ]}
        />
        <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          No se encontró el miembro.
        </div>
      </div>
    )
  }

  const memberName = `${member.name} ${member.surname}`

  return (
    <div className="space-y-4">
      <BreadCrumb
        crumbs={[
          { label: 'Socios', href: '/administrativo/socios' },
          { label: memberName, href: `/administrativo/socios/${id}` },
          { label: 'Editar' },
        ]}
      />

      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Edición de Socio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Edita los datos del socio según sea necesario.
        </p>
      </section>

      <div>
        <MemberForm member={member} onSubmit={handleSubmit} />
      </div>

      <section className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/administrativo/socios/${id}`)}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button type="submit" form="member-form" className="w-full sm:w-auto">
          Guardar cambios
        </Button>
      </section>
    </div>
  )
}