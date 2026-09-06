import type {
  CreateMembershipPaymentInput,
  CreatePaymentInput,
  Payment,
  UpdatePaymentInput,
} from '../models/Payment'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

async function getErrorMessage(response: Response, fallback: string) {
  const error = await response.json().catch(() => null)
  return error?.message || fallback
}

export const paymentService = {
  async getAll(membershipId?: number): Promise<Payment[]> {
    const query = membershipId ? `?membershipId=${membershipId}` : ''
    const response = await fetch(`${baseUrl}/api/payments${query}`)
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Error al obtener pagos'))
    }
    return response.json()
  },

  async getById(id: number): Promise<Payment> {
    const response = await fetch(`${baseUrl}/api/payments/${id}`)
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Error al obtener pago'))
    }
    return response.json()
  },

  async create(data: CreatePaymentInput): Promise<Payment> {
    const response = await fetch(`${baseUrl}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Error al registrar pago'))
    }
    return response.json()
  },

  async createForMembership(
    membershipId: number,
    data: CreateMembershipPaymentInput,
  ): Promise<Payment> {
    const response = await fetch(`${baseUrl}/api/memberships/${membershipId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Error al registrar pago'))
    }
    return response.json()
  },

  async update(id: number, data: UpdatePaymentInput): Promise<Payment> {
    const response = await fetch(`${baseUrl}/api/payments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Error al actualizar pago'))
    }
    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/api/payments/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Error al eliminar pago'))
    }
  },
}