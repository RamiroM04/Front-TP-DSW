import { useNavigate } from 'react-router-dom'
import BreadCrumb from '@/shared/components/BreadCrumb'
import { Button } from '@/shared/components/ui/button'
import MemberForm from '@/features/members/components/MemberForm'
import PlanSelector from '@/features/membershipPlans/components/PlanSelector'
import PaymentMethodSelector from '@/features/memberships/components/PaymentMethodSelector'
import { useNewMember } from '@/features/members/hooks/useNewMember'

export default function NewMemberPage() {
  const navigate = useNavigate()
  const {
    plans,
    loading,
    selectedPlanId,
    setSelectedPlanId,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    activationDate,
    expirationDate,
    handleSubmit,
  } = useNewMember()

  if (loading) {
    return (
      <div className="space-y-4">
        <BreadCrumb
          crumbs={[
            { label: 'Socios', href: '/administrativo/socios' },
            { label: 'Nuevo Socio' },
          ]}
        />
        <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Nuevo Socio
          </h1>
        </section>
        <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 text-center">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BreadCrumb
        crumbs={[
          { label: 'Socios', href: '/administrativo/socios' },
          { label: 'Nuevo Socio' },
        ]}
      />
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Nuevo Socio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Completá los datos del socio, seleccioná un plan y definí el método de pago.
        </p>
      </section>

      <div>
        <MemberForm onSubmit={handleSubmit} />
      </div>

      <PlanSelector
        plans={plans}
        selectedPlanId={selectedPlanId}
        onSelectPlan={setSelectedPlanId}
      />

      <PaymentMethodSelector
        selectedMethod={selectedPaymentMethod}
        onSelectMethod={setSelectedPaymentMethod}
        activationDate={activationDate}
        expirationDate={expirationDate}
      />

      <section className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/administrativo/socios')}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button type="submit" form="member-form" className="w-full sm:w-auto">
          Confirmar Alta
        </Button>
      </section>
    </div>
  )
}
