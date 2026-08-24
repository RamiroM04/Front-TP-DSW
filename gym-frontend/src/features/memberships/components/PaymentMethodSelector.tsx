import { CreditCard, HandCoins, Landmark } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export const PAYMENT_METHODS = [
  { id: 'CREDIT_CARD', label: 'Tarjeta', icon: CreditCard },
  { id: 'CASH', label: 'Efectivo', icon: HandCoins },
  { id: 'TRANSFER', label: 'Transferencia', icon: Landmark },
] as const

export type PaymentMethodId = typeof PAYMENT_METHODS[number]['id']

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodId
  onSelectMethod: (method: PaymentMethodId) => void
  activationDate: Date
  expirationDate: Date
  description?: string
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
  activationDate,
  expirationDate,
  description = 'Seleccioná cómo se realizará el pago de la membresía.',
}: PaymentMethodSelectorProps) {
  return (
    <section className="rounded-xl border bg-background px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-4 space-y-1">
        <h2 className="text-lg font-semibold">Método de Pago</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

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
  )
}

export default PaymentMethodSelector
