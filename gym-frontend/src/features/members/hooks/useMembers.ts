import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { memberService } from '@/features/members/api/memberService'
import { membershipService } from '@/features/memberships/api/membershipService'
import { membershipPlanService } from '@/features/membershipPlans/api/membershipPlanService'
import type { ExtendedMember } from '@/features/members/models/ExtendedMember'

export function useMembers() {
  const [members, setMembers] = useState<ExtendedMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await memberService.getAllMembers()
      const extendedMembers: ExtendedMember[] = await Promise.all(
        data.map(async (member) => {
          try {
            const membership = await membershipService.getMembershipByMemberId(member.id)
            const plan = await membershipPlanService.getById(membership.membershipPlanId)
            return {
              ...member,
              plan: plan.name,
              nextExpiration: membership.endDate,
            }
          } catch (err) {
            console.error(`Error al obtener datos del miembro ${member.id}: `, err)
            return {
              ...member,
              plan: 'Plan no disponible',
              nextExpiration: member.createdAt,
            }
          }
        })
      )
      setMembers(extendedMembers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este miembro?')) return
    try {
      await memberService.delete(id)
      toast.success('Miembro eliminado exitosamente')
      await loadMembers()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(errorMessage)
    }
  }

  const activeCount = members.filter((m) => m.status === 'ACTIVE').length
  const inactiveCount = members.filter((m) => m.status === 'INACTIVE').length
  const totalCount = members.length

  return {
    members,
    loading,
    error,
    activeCount,
    inactiveCount,
    totalCount,
    handleDelete,
    loadMembers,
  }
}
