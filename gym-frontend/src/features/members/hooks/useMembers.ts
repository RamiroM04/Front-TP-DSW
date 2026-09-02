import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { memberService } from '@/features/members/api/memberService';
import type { ExtendedMember } from '@/features/members/models/ExtendedMember';
import type { MemberWithMembership } from '@/features/members/models/MemberWithMembership';

export function useMembers() {
  const [members, setMembers] = useState<ExtendedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await memberService.getAllMembersWithMembership();
        const extendedMembers: ExtendedMember[] = (
          data as MemberWithMembership[]
        ).map((member) => ({
          ...member,
          plan: member.membership?.membershipPlan?.name || 'Plan no disponible',
          nextExpiration: member.membership?.endDate || member.createdAt,
        }));

        setMembers(extendedMembers);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este miembro?')) return;
    try {
      await memberService.delete(id);
      toast.success('Miembro eliminado exitosamente');
      setMembers((prevMembers) => prevMembers.filter((m) => m.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al eliminar';
      toast.error(errorMessage);
    }
  };

  const activeCount = members.filter((m) => m.status === 'ACTIVE').length;
  const inactiveCount = members.filter((m) => m.status === 'INACTIVE').length;
  const totalCount = members.length;

  return {
    members,
    loading,
    error,
    activeCount,
    inactiveCount,
    totalCount,
    handleDelete,
  };
}
