import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CreditCard, HandCoins, Landmark } from 'lucide-react'

import BreadCrumb from '@/components/BreadCrumb'
import { Button } from '@/components/ui/button'
import MemberForm from '@/components/admin/MemberForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

import { type Member, type UpdateMemberInput } from '@/models/Member'
import { type Membership } from '@/models/Membership'
import { memberService } from '@/services/memberService'
import { membershipService } from '@/services/membershipService'
import { membershipPlanService } from '@/services/membershipPlanService'
import { type MembershipPlan } from '@/models/MembershipPlan'

const paymentMethods = [
  { id: 'CREDIT_CARD', label: 'Tarjeta', icon: CreditCard },
  { id: 'CASH', label: 'Efectivo', icon: HandCoins },
  { id: 'TRANSFER', label: 'Transferencia', icon: Landmark },
] as const

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default function EditMemberPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [member, setMember] = useState<Member | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<typeof paymentMethods[number]['id']>('CASH')

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true)

        if (!id) {
          toast.error('ID de miembro no válido')
          navigate('/administrativo/socios')
          return
        }

        const memberData = await memberService.getMemberById(Number(id))
        setMember(memberData)

        const membershipData = await membershipService.getMembershipByMemberId(Number(id))
        setMembership(membershipData)
        setSelectedPlanId(membershipData.membershipPlanId)


        if (membershipData.lastPaymentMethod) {
          setSelectedPaymentMethod(membershipData.lastPaymentMethod as typeof paymentMethods[number]['id'])
        }

        const plansData = await membershipPlanService.getAllMembershipPlans()
        setPlans(plansData)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar miembro'
        toast.error(errorMessage)
        navigate('/administrativo/socios')
      } finally {
        setLoading(false)
      }
    }

    loadMember()
  }, [id, navigate])

  const activationDate = useMemo(() => {
    if (membership) {
      return new Date(membership.startDate)
    }
    return new Date()
  }, [membership])

  const expirationDate = useMemo(() => {
    if (selectedPlanId && plans.length > 0) {
      const plan = plans.find(p => p.id === selectedPlanId)
      if (plan && membership) {
        const nextDueDate = new Date(membership.startDate)
        nextDueDate.setDate(nextDueDate.getDate() + plan.durationDays)
        return nextDueDate
      }
    }
    return new Date(membership?.endDate || new Date())
  }, [selectedPlanId, plans, membership])

  const handleSubmit = async (data: UpdateMemberInput) => {
    try {
      if (!id || !membership) {
        throw new Error('ID de miembro no válido')
      }


      if (!selectedPlanId) {
        toast.error('Debes seleccionar un plan')
        return
      }


      await memberService.update(Number(id), data)


      if (selectedPlanId !== membership.membershipPlanId || selectedPaymentMethod !== membership.lastPaymentMethod) {
        const selectedPlan = plans.find(p => p.id === selectedPlanId)

        const startDate = new Date(membership.startDate)
        const endDate = new Date(startDate)
        if (selectedPlan) {
          endDate.setDate(endDate.getDate() + selectedPlan.durationDays)
        }

        await membershipService.update(membership.id, {
          membershipPlanId: selectedPlanId,
          lastPaymentMethod: selectedPaymentMethod,
          lastPaymentDate: new Date().toISOString(),
          lastPaymentAmount: selectedPlan?.price,
          endDate: endDate.toISOString(),
        })
      }

      toast.success('Miembro actualizado exitosamente')
      navigate(`/administrativo/socios`)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido'
      toast.error(errorMessage)
    }
  }

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

      {/* ✅ Selección de Plan */}
      {plans.length > 0 && (
        <section className="rounded-xl border bg-background px-4 py-4 sm:px-6 sm:py-6">
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold">Selección de Plan</h2>
            <p className="text-sm text-muted-foreground">
              Cambiar el plan de membresía.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id
              return (
                <Card
                  key={plan.id}
                  className={isSelected ? 'border-2 border-primary' : 'border border-border/70'}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPlanId(plan.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedPlanId(plan.id)
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
                    <p className="text-base font-semibold">${plan.price.toLocaleString()} / {plan.durationDays} días</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* ✅ Método de Pago */}
      <section className="rounded-xl border bg-background px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold">Método de Pago</h2>
          <p className="text-sm text-muted-foreground">
            Cambiar el método de pago de la membresía.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              const isSelected = selectedPaymentMethod === method.id
              return (
                <Button
                  key={method.id}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className="min-w-32"
                  aria-pressed={isSelected}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {method.label}
                </Button>
              )
            })}
          </div>
          <div className="space-y-1 border-border/80 pt-1 text-sm lg:border-l lg:pl-6 lg:text-right">
            <p>
              <span className="font-medium">Activación:</span> {formatDate(activationDate)}
            </p>
            <p>
              <span className="font-medium">Próximo vencimiento:</span> {formatDate(expirationDate)}
            </p>
          </div>
        </div>
      </section>

      <section className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/administrativo/socios/${id}`)}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="member-form"
          className="w-full sm:w-auto"
        >
          Guardar cambios
        </Button>
      </section>
    </div>
  )
}