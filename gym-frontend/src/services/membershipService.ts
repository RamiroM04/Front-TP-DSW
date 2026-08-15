import { type Membership } from '../models/Membership';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const membershipService = {
  async getMembershipByMemberId(memberId: number): Promise<Membership> {
    const response = await fetch(
      `${baseUrl}/api/memberships/member/${memberId}`,
    );
    if (!response.ok) {
      throw new Error('Error al obtener membresía del miembro');
    }
    return response.json();
  },

  async create(data: {
    memberId: number;
    membershipPlanId: number;
    startDate: string;
    endDate: string;
  }): Promise<Membership> {
    const response = await fetch(`${baseUrl}/api/memberships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al crear membresía');
    }
    return response.json();
  },

  async update(
    membershipId: number,
    data: { membershipPlanId: number },
  ): Promise<Membership> {
    const response = await fetch(`${baseUrl}/api/memberships/${membershipId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la membresía');
    }
    return response.json();
  },
};
