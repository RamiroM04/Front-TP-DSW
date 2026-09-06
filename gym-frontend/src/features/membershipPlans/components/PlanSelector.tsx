import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'

interface PlanSelectorProps {
  plans: MembershipPlan[]
  selectedPlanId: number | null
  onSelectPlan: (id: number) => void
  title?: string
  description?: string
}

export function PlanSelector({
  plans,
  selectedPlanId,
  onSelectPlan,
}: PlanSelectorProps) {
  if (plans.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => {
        const isSelected = selectedPlanId === plan.id
        return (
          <Card
            key={plan.id}
            className={isSelected ? 'border-2 border-primary' : 'border border-border/70'}
            role="button"
            tabIndex={0}
            onClick={() => onSelectPlan(plan.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelectPlan(plan.id)
              }
            }}
            aria-pressed={isSelected}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <Checkbox
                  id={`plan-${plan.id}`}
                  checked={isSelected}
                  aria-label={`Seleccionar ${plan.name}`}
                  className="pointer-events-none"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base font-semibold">
                ${plan.price.toLocaleString()} / {plan.durationDays} días
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default PlanSelector
