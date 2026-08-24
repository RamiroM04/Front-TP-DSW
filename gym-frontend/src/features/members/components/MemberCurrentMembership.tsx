import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import type { Membership } from '@/features/memberships/models/Membership'
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'

function formatDate(date: string | undefined | null) {
  if (!date) return '-'
  const parsed = new Date(date)
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

interface MemberCurrentMembershipProps {
  membership: Membership
  plan: MembershipPlan | null
}

export function MemberCurrentMembership({
  membership,
  plan,
}: MemberCurrentMembershipProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membresía actual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1">
          <p className="text-2xl font-semibold tracking-tight">
            {plan?.name || 'Plan no disponible'}
          </p>
          <p className="text-sm text-muted-foreground">
            {plan?.description || '-'}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/35 p-3 space-y-2">
          <div className="mb-1 flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Activación</span>
              <span className="font-semibold">
                {formatDate(membership.startDate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Próximo vencimiento</span>
              <span className="font-semibold">
                {formatDate(membership.endDate)}
              </span>
            </div>
          </div>
          {(membership.lastPaymentMethod || membership.lastPaymentAmount) && (
            <div className="border-t pt-2 space-y-1">
              {membership.lastPaymentMethod && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Último pago</span>
                  <span className="font-semibold">
                    {formatDate(membership.lastPaymentDate)}
                  </span>
                </div>
              )}
              {membership.lastPaymentAmount && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Monto</span>
                  <span className="font-semibold">
                    ${membership.lastPaymentAmount.toLocaleString('es-AR')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <Badge variant="outline" className="w-full justify-center py-2">
          {membership.status === 'ACTIVE' ? 'Membresía Activa' : 'Membresía Vencida'}
        </Badge>
      </CardContent>
    </Card>
  )
}

export default MemberCurrentMembership
