import { CreditCard, HandCoins, Landmark } from 'lucide-react'

export type PaymentMethod =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'TRANSFER'
  | 'CASH'

export type Payment = {
  id: number
  amount: number | string
  method: PaymentMethod
  paymentDate: string
  periodStart: string
  periodEnd: string
  membershipId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type CreatePaymentInput = {
  membershipId: number
  amount: number
  method: PaymentMethod
  paymentDate?: string
  periodStart: string
  periodEnd: string
}

export type CreateMembershipPaymentInput = Omit<CreatePaymentInput, 'membershipId'>

export type UpdatePaymentInput = Partial<CreatePaymentInput>

export const PAYMENT_METHODS = [
  { id: 'CREDIT_CARD', label: 'Tarjeta', icon: CreditCard },
  { id: 'DEBIT_CARD', label: 'Débito', icon: CreditCard },
  { id: 'CASH', label: 'Efectivo', icon: HandCoins },
  { id: 'TRANSFER', label: 'Transferencia', icon: Landmark },
] as const