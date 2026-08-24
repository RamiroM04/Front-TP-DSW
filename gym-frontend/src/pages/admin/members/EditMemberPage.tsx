import { useNavigate } from 'react-router-dom'
import BreadCrumb from '@/shared/components/BreadCrumb'
import { Button } from '@/shared/components/ui/button'
import MemberForm from '@/features/members/components/MemberForm'
import PlanSelector from '@/features/members/components/PlanSelector'
import PaymentMethodSelector from '@/features/members/components/PaymentMethodSelector'
import { useEditMember } from '@/features/members/hooks/useEditMember'

export default function EditMemberPage() {
  const navigate = useNavigate()
  const {
    id,
    member,
    membership,
    plans,
    loading,
    selectedPlanId,
    setSelectedPlanId,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    activationDate,
    expirationDate,
    handleSubmit,
  } = useEditMember()

  if (loading) {
    return (
      <div className="space-y-4">
        <BreadCrumb />
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

  if (!member || !membership) {
    return (
      <div className="space-y-4">
        <BreadCrumb />
        <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          No se encontró el miembro.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BreadCrumb />

      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Edición de Socio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Edita los datos del socio, plan y método de pago según sea necesario.
        </p>
      </section>

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <MemberForm member={member} onSubmit={handleSubmit} />
      </div>

      <PlanSelector
        plans={plans}
        selectedPlanId={selectedPlanId}
        onSelectPlan={setSelectedPlanId}
        title="Selección de Plan"
        description="Cambiar el plan de membresía."
      />

      <PaymentMethodSelector
        selectedMethod={selectedPaymentMethod}
        onSelectMethod={setSelectedPaymentMethod}
        activationDate={activationDate}
        expirationDate={expirationDate}
        description="Cambiar el método de pago de la membresía."
      />

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