import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { type Member, type UpdateMemberInput } from '@/features/members/models/Member'
import { type Membership } from '@/features/memberships/models/Membership'
import { type MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'
import { memberService } from '@/features/members/api/memberService'
import { membershipService } from '@/features/memberships/api/membershipService'
import { membershipPlanService } from '@/features/membershipPlans/api/membershipPlanService'
import { type PaymentMethodId } from '@/features/members/components/PaymentMethodSelector'

export function useEditMember() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [member, setMember] = useState<Member | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId>('CASH')

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
          setSelectedPaymentMethod(membershipData.lastPaymentMethod as PaymentMethodId)
        }

        const plansData = await membershipPlanService.getAll()
        setPlans(plansData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar miembro'
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
      const plan = plans.find((p) => p.id === selectedPlanId)
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

      if (
        selectedPlanId !== membership.membershipPlanId ||
        selectedPaymentMethod !== membership.lastPaymentMethod
      ) {
        const selectedPlan = plans.find((p) => p.id === selectedPlanId)

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
      navigate('/administrativo/socios')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast.error(errorMessage)
    }
  }

  return {
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
  }
}
