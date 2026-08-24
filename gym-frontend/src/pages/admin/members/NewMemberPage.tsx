import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { CreditCard, HandCoins, Landmark } from 'lucide-react'
import { toast } from 'sonner'


import { type CreateMemberInput, type Member, type UpdateMemberInput } from '@/features/members/models/Member'
import { type Membership } from '@/features/memberships/models/Membership'
import { memberService } from '@/features/members/api/memberService'
import { membershipPlanService } from '@/features/membershipPlans/api/membershipPlanService'
import { membershipService } from '@/features/memberships/api/membershipService'
import { type MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'
import MemberForm from '@/features/members/components/MemberForm'
import BreadCrumb from '@/shared/components/BreadCrumb'
import { Button } from '@/shared/components/ui/button'

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

export default function NewMemberPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const [member, setMember] = useState<Member | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<typeof paymentMethods[number]['id']>('CASH')

  const isEditing = !!id

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const plansData = await membershipPlanService.getAll()
        setPlans(plansData)

        if (isEditing && id) {
          const memberData = await memberService.getMemberById(Number(id))
          setMember(memberData)
          const membershipData = await membershipService.getMembershipByMemberId(Number(id))
          setMembership(membershipData)
          setSelectedPlanId(membershipData?.membershipPlanId)
        } else {
          if (plansData.length > 0) {
            setSelectedPlanId(plansData[0].id)
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        toast.error(errorMessage)
        navigate('/administrativo/socios')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, isEditing, navigate])

  const activationDate = useMemo(() => {
    if (isEditing && membership) {
      return new Date(membership.startDate)
    }
    return new Date()
  }, [isEditing, membership])

  const expirationDate = useMemo(() => {
    if (isEditing && membership) {
      return new Date(membership.endDate)
    }

    if (selectedPlanId && plans.length > 0) {
      const plan = plans.find(p => p.id === selectedPlanId)
      if (plan) {
        const nextDueDate = new Date(activationDate)
        nextDueDate.setDate(nextDueDate.getDate() + plan.durationDays)
        return nextDueDate
      }
    }

    const nextDueDate = new Date(activationDate)
    nextDueDate.setMonth(nextDueDate.getMonth() + 1)
    return nextDueDate
  }, [isEditing, membership, selectedPlanId, plans, activationDate])

  const handleSubmit = async (data: CreateMemberInput | UpdateMemberInput) => {
    try {
      if (!selectedPlanId) {
        toast.error('Debes seleccionar un plan')
        return
      }

      if (isEditing && id) {
        await memberService.update(Number(id), data as UpdateMemberInput)
        if (membership?.id && selectedPlanId && selectedPlanId !== membership.membershipPlanId) {
          await membershipService.update(membership.id, {
            membershipPlanId: selectedPlanId,
          })
        }
        toast.success('Socio actualizado correctamente')
      } else {
        const dataWithPlan = {
          ...data,
          membershipPlanId: selectedPlanId,
          lastPaymentMethod: selectedPaymentMethod,
          lastPaymentDate: activationDate.toISOString(),
          lastPaymentAmount: plans.find(p => p.id === selectedPlanId)?.price || 0,
        } as CreateMemberInput
        await memberService.create(dataWithPlan)
        toast.success('Socio creado correctamente')
      }
      navigate('/administrativo/socios')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast.error(errorMessage)
      throw err
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
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
      <BreadCrumb />
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Completá los datos del socio, seleccioná un plan y definí el método de pago.
        </p>
      </section>

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <MemberForm
          member={member || undefined}
          onSubmit={handleSubmit}
        />
      </div>

      {plans.length > 0 && (
        <section className="rounded-xl border bg-background px-4 py-4 sm:px-6 sm:py-6">
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold"> Selección de Plan</h2>
            <p className="text-sm text-muted-foreground">
              Elige uno de los planes disponibles para este socio.
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
                  aria-pressed={isSelected}>
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

      <section className="rounded-xl border bg-background px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold">Método de Pago</h2>
          <p className="text-sm text-muted-foreground">
            Seleccioná cómo se realizará el pago de la membresía.
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
          onClick={() => navigate('/administrativo/socios')}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="member-form"
          className="w-full sm:w-auto">
          {isEditing ? 'Actualizar Socio' : 'Confirmar Alta'}
        </Button>
      </section>
    </div>
  )
}
