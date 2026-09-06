import { useState } from 'react'
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
import { paymentService } from '@/features/payments/api/paymentService'
import type { PaymentMethod } from '@/features/payments/models/Payment'
import { PAYMENT_METHODS } from '@/features/payments/models/Payment'
import { formatDate } from '@/shared/utils/formatDate'

export type PaymentMethodId = PaymentMethod

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodId
  onSelectMethod: (method: PaymentMethodId) => void
  totalAmount?: number
  activationDate: Date
  expirationDate: Date
  disabled?: boolean
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
  totalAmount = 0,
  activationDate,
  expirationDate,
  disabled = false,
}: PaymentMethodSelectorProps) {
  return (
    <section
      className={`${disabled ? 'opacity-50' : ''}`}
      aria-disabled={disabled}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon
            const isSelected = selectedMethod === method.id
            return (
              <Button
                key={method.id}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => onSelectMethod(method.id)}
                disabled={disabled}
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
            <span className="font-medium">Total a Cobrar:</span>  {disabled ? '---' : `$${totalAmount}`}
          </p>
          <p>
            <span className="font-medium">Activación:</span> {formatDate(activationDate)}
          </p>
          <p>
            <span className="font-medium">Próximo vencimiento:</span> {formatDate(expirationDate)}
          </p>
        </div>
      </div>
    </section>
  )
}

export default PaymentMethodSelector

interface PaymentRegistrationDialogProps {
  isEnabled?: boolean
  membershipId: number
  plan: { price: number; durationDays: number }
  onPaymentRegistered: () => Promise<void>
}

export function PaymentRegistrationDialog({
  isEnabled = true,
  membershipId,
  plan,
  onPaymentRegistered,
}: PaymentRegistrationDialogProps) {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState<PaymentMethodId>('CASH')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dates are always calculated from today (API ignores old membership dates on renewal)
  const periodStart = new Date()
  const periodEnd = new Date()
  periodEnd.setDate(periodEnd.getDate() + plan.durationDays)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await paymentService.createForMembership(membershipId, {
        amount: plan.price,
        method,
        paymentDate: new Date().toISOString(),
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
      })
      await onPaymentRegistered()
      setOpen(false)
      toast.success('Pago registrado correctamente')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar pago')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" className="w-full" onClick={() => setOpen(true)} disabled={!isEnabled}>
        Registrar pago
      </Button>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            El monto y el período corresponden al plan actual de la membresía.
          </DialogDescription>
        </DialogHeader>

        <PaymentMethodSelector
          selectedMethod={method}
          onSelectMethod={setMethod}
          totalAmount={plan.price}
          activationDate={periodStart}
          expirationDate={periodEnd}
          disabled={isSubmitting}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Confirmar pago'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
