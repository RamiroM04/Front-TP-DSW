import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { PlanSelector } from '@/features/membershipPlans/components/PlanSelector'
import type { Membership } from '@/features/memberships/models/Membership'
import type { MembershipPlan } from '@/features/membershipPlans/models/MembershipPlan'
import { membershipService } from '@/features/memberships/api/membershipService'
import { membershipPlanService } from '@/features/membershipPlans/api/membershipPlanService'

interface ManageMembershipDialogProps {
  membership: Membership
  onUpdated: () => Promise<void>
}

export function ManageMembershipDialog({ membership, onUpdated }: ManageMembershipDialogProps) {
  const [open, setOpen] = useState(false)
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState(membership.membershipPlanId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  const isCancelled = membership.status === 'CANCELLED'
  const isPlanChanged = selectedPlanId !== membership.membershipPlanId

  useEffect(() => {
    if (!open) return

    setSelectedPlanId(membership.membershipPlanId)
    setConfirmingCancel(false)

    membershipPlanService
      .getAll()
      .then(setPlans)
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Error al obtener los planes')
      })
  }, [open, membership.membershipPlanId])

  const handleSavePlan = async () => {
    try {
      setIsSubmitting(true)
      await membershipService.update(membership.id, { membershipPlanId: selectedPlanId })
      await onUpdated()
      setOpen(false)
      toast.success('Plan actualizado correctamente')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelMembership = async () => {
    try {
      setIsSubmitting(true)
      await membershipService.update(membership.id, { status: 'CANCELLED' })
      await onUpdated()
      setOpen(false)
      toast.success('Membresía cancelada correctamente')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cancelar la membresía')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleActivateMembership = async () => {
    try {
      setIsSubmitting(true)
      await membershipService.update(membership.id, { status: 'ACTIVE' })
      await onUpdated()
      toast.success('Membresía activada correctamente')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al activar la membresía')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" className="w-full" variant="outline" onClick={() => setOpen(true)}>
        Gestionar membresía
      </Button>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gestionar membresía</DialogTitle>
          <DialogDescription>
            Cambiá el plan de la membresía o cancelala si corresponde.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <div
            className={isSubmitting || isCancelled ? 'pointer-events-none opacity-50' : undefined}
            aria-disabled={isSubmitting || isCancelled}
          >
            <PlanSelector
              plans={plans}
              selectedPlanId={selectedPlanId}
              onSelectPlan={setSelectedPlanId}
            />
          </div>
        </div>

        {isCancelled ? (
          <p className="text-sm text-muted-foreground">
            Esta membresía se encuentra cancelada. Podés reactivarla si corresponde.
          </p>
        ) : (
          confirmingCancel && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm">
              ¿Confirmás que querés cancelar esta membresía?.
            </div>
          )
        )}

        <DialogFooter className="sm:justify-between">
          {isCancelled ? (
            <Button
              type="button"
              onClick={handleActivateMembership}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Activando...' : 'Activar membresía'}
            </Button>
          ) : (
            confirmingCancel ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmingCancel(false)}
                  disabled={isSubmitting}
                >
                  Volver
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleCancelMembership}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Cancelando...' : 'Confirmar cancelación'}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConfirmingCancel(true)}
                disabled={isSubmitting || isPlanChanged}
              >
                Cancelar membresía
              </Button>
            )
          )}
          {!confirmingCancel && !isCancelled && (
            <Button
              type="button"
              onClick={isPlanChanged ? handleSavePlan : () => setOpen(false)}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando...'
                : isPlanChanged
                  ? 'Cambiar membresía'
                  : 'Volver'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ManageMembershipDialog
