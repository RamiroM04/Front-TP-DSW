import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { MEMBERSHIP_STATUS, type Membership } from '@/features/memberships/models/Membership'
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'
import { PaymentRegistrationDialog } from '@/features/payments/components/PaymentForm'
import { ManageMembershipDialog } from '@/features/memberships/components/ManageMembershipDialog'
import { formatDate } from '@/shared/utils/formatDate'

interface MemberCurrentMembershipProps {
  membership: Membership
  plan: MembershipPlan | null
  onPaymentRegistered: () => Promise<void>
}

export function MemberCurrentMembership({
  membership,
  plan,
  onPaymentRegistered,
}: MemberCurrentMembershipProps) {
  const membershipStatus = MEMBERSHIP_STATUS.find(status => status.id === membership.status)
  const membershipLabel = membershipStatus?.label || ''
  const membershipVariant = membershipStatus?.variant || 'default'

  return (
    <Card>
      <CardHeader className="flex w-full justify-between">
        <CardTitle className="text-lg font-bold">Membresía</CardTitle>

        <Badge className="px-4 py-3 text-md" variant={membershipVariant}>
          {membershipLabel}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-3xl font-semibold">
            {plan?.name ? `Plan ${plan.name}` : 'Plan no disponible'}
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
        </div>

        <ManageMembershipDialog membership={membership} onUpdated={onPaymentRegistered} />

        {membership.status && plan && (
          <PaymentRegistrationDialog
            isEnabled={membership.status && membership.status == 'EXPIRED'}
            membershipId={membership.id}
            plan={plan}
            onPaymentRegistered={onPaymentRegistered}
          />
        )}
      </CardContent>
    </Card >
  )
}

export default MemberCurrentMembership
