import {
  type MembershipPlan,
  type CreateMembershipPlanInput,
  type UpdateMembershipPlanInput
} from '@/features/membershipPlans/models/MembershipPlan';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const membershipPlanService = {
  async getAll(): Promise<MembershipPlan[]> {
    const response = await fetch(`${baseUrl}/api/membership-plans`);
    if (!response.ok) {
      throw new Error('Error al obtener los planes');
    }
    return response.json();
  },

  async getById(id: number): Promise<MembershipPlan> {
    const response = await fetch(`${baseUrl}/api/membership-plans/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el plan');
    }
    return response.json();
  },

  //TODO: Faltan las validaciones 
  async create(data: CreateMembershipPlanInput): Promise<MembershipPlan> {
    const response = await fetch(`${baseUrl}/api/membership-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear el plan');
    }
    return response.json();
  },

  async update(id: number, data: UpdateMembershipPlanInput): Promise<MembershipPlan> {
    const response = await fetch(`${baseUrl}/api/membership-plans/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar el plan');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/api/membership-plans/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar el plan');
    }
  },
}