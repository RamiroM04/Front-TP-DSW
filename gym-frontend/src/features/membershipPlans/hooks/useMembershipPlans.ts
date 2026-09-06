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
  function handleDelete(id: number) {
    const request = membershipPlanService.delete(id).then(() => {
      setMembershipPlans((prev) => prev.filter((p) => p.id !== id))
    })

    toast.promise(request, {
      loading: "Eliminando plan...",
      success: "Plan de membresía eliminado correctamente",
      error: (error) =>
        error instanceof Error ? error.message : "Error al eliminar el plan de membresía",
    })

    return request
  }

  // Crea un plan nuevo o actualiza uno existente, según si vino un id.
  function handleSave(data: CreateMembershipPlanInput, id?: number) {
    const request =
      id !== undefined
        ? membershipPlanService.update(id, data).then((updatedPlan) => {
            setMembershipPlans((prev) =>
              prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
            )
          })
        : membershipPlanService.create(data).then((newPlan) => {
            setMembershipPlans((prev) => [...prev, newPlan])
          })

    toast.promise(request, {
      loading: id !== undefined ? "Actualizando plan..." : "Creando plan...",
      success:
        id !== undefined
          ? "Plan de membresía actualizado correctamente"
          : "Plan de membresía creado correctamente",
      error: (error) =>
        error instanceof Error ? error.message : "Error al guardar el plan de membresía",
    })

    return request
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
