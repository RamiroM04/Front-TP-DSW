import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { type Member, type UpdateMemberInput } from '@/features/members/models/Member'
import { memberService } from '@/features/members/api/memberService'

export function useEditMember() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

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

  const handleSubmit = async (data: UpdateMemberInput) => {
    try {
      if (!id) {
        throw new Error('ID de miembro no válido')
      }

      await memberService.update(Number(id), data)

      toast.success('Miembro actualizado exitosamente')
      navigate(`/administrativo/socios/${id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast.error(errorMessage)
    }
  }

  return {
    id,
    member,
    loading,
    handleSubmit,
  }
}
