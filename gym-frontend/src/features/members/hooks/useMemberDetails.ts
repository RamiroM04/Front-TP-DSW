import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { Member } from '@/features/members/models/Member'
import type { Membership } from '@/features/memberships/models/Membership'
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'
import { memberService } from '@/features/members/api/memberService'
import { membershipService } from '@/features/memberships/api/membershipService'
import { membershipPlanService } from '@/features/membershipPlans/api/membershipPlanService'

export function useMemberDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [member, setMember] = useState<Member | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [plan, setPlan] = useState<MembershipPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMemberDetails = async () => {
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

        const planData = await membershipPlanService.getById(membershipData.membershipPlanId)
        setPlan(planData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar perfil'
        toast.error(errorMessage)
        navigate('/administrativo/socios')
      } finally {
        setLoading(false)
      }
    }

    loadMemberDetails()
  }, [id, navigate])

  return {
    id,
    member,
    membership,
    plan,
    loading,
  }
}
