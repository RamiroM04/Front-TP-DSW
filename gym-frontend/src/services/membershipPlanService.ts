import { type MembershipPlan } from '../models/MembershipPlan';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const membershipPlanService = {
  async getAllMembershipPlans(): Promise<MembershipPlan[]> {
    const response = await fetch(`${baseUrl}/api/membership-plans`);
    if (!response.ok) {
      throw new Error('Error al obtener planes');
    }
    return response.json();
  },

  async getMembershipPlanById(id: number): Promise<MembershipPlan> {
    const response = await fetch(`${baseUrl}/api/membership-plans/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener plan');
    }
    return response.json();
  },
};
