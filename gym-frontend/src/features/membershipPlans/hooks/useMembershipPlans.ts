import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { MembershipPlan, CreateMembershipPlanInput } from "@/features/membershipPlans/models/MembershipPlan"
import { membershipPlanService } from "@/features/membershipPlans/api/membershipPlanService"

export function useMembershipPlans() {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [planToEdit, setPlanToEdit] = useState<MembershipPlan | null>(null)

  useEffect(() => {
    async function loadMembershipPlans() {
      try {
        const data = await membershipPlanService.getAll()
        setMembershipPlans(data)
      } catch (error) {
        toast.error("Error al cargar los planes de membresía")
      } finally {
        setLoading(false)
      }
    }
    loadMembershipPlans()
  }, [])

  // Abre el modal en modo "crear" (sin plan precargado).
  function handleNew() {
    setPlanToEdit(null)
    setDialogOpen(true)
  }

  // Abre el modal en modo "editar", con el plan elegido precargado.
  function handleEdit(plan: MembershipPlan) {
    setPlanToEdit(plan)
    setDialogOpen(true)
  }

  // Elimina un plan del estado en memoria y backend.
  async function handleDelete(id: number) {
    try {
      await membershipPlanService.delete(id)
      setMembershipPlans((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      toast.error("Error al eliminar el plan de membresía")
    }
  }

  // Crea un plan nuevo o actualiza uno existente, según si vino un id.
  async function handleSave(data: CreateMembershipPlanInput, id?: number) {
    try {
      if (id !== undefined) {
        const updatedPlan = await membershipPlanService.update(id, data)
        setMembershipPlans((prev) =>
          prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
        )
        toast.success("Plan de membresía actualizado correctamente")
        return
      }

      const newPlan = await membershipPlanService.create(data as CreateMembershipPlanInput)
      setMembershipPlans((prev) => [...prev, newPlan])
      toast.success("Plan de membresía creado correctamente")
    } catch (error) {
      toast.error("Error al guardar el plan de membresía")
    }
  }

  return {
    membershipPlans,
    loading,
    dialogOpen,
    setDialogOpen,
    planToEdit,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
  }
}
