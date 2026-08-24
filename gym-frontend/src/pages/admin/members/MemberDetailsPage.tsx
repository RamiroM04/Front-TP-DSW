import BreadCrumb from '@/shared/components/BreadCrumb'
import MemberDetailsHeader from '@/features/members/components/MemberDetailsHeader'
import MemberPersonalDetails from '@/features/members/components/MemberPersonalDetails'
import MemberCurrentMembership from '@/features/members/components/MemberCurrentMembership'
import { useMemberDetails } from '@/features/members/hooks/useMemberDetails'

export default function MemberDetailsPage() {
  const { member, membership, plan, loading } = useMemberDetails()

  if (loading) {
    return (
      <div className="space-y-4">
        <BreadCrumb
          crumbs={[
            { label: 'Socios', href: '/administrativo/socios' },
            { label: 'Cargando...' },
          ]}
        />
        <div className="rounded-xl border bg-background px-4 py-6 sm:px-6 text-center">
          <p>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!member || !membership) {
    return (
      <div className="space-y-4">
        <BreadCrumb
          crumbs={[
            { label: 'Socios', href: '/administrativo/socios' },
            { label: 'Perfil de socio' },
          ]}
        />
        <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          No se encontró el perfil del socio.
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
          { label: memberName },
        ]}
      />

      <MemberDetailsHeader member={member} />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(250px,1fr)] lg:items-start">
        <MemberPersonalDetails member={member} />
        <MemberCurrentMembership membership={membership} plan={plan} />
      </section>
    </div>
  )
}