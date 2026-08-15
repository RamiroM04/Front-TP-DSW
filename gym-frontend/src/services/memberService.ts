import {
  type Member,
  type CreateMemberInput,
  type UpdateMemberInput,
} from '../models/Member';
import { type Membership } from '../models/Membership';
import { type MembershipPlan } from '../models/MembershipPlan';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const memberService = {
  async getAllMembers(): Promise<Member[]> {
    const response = await fetch(`${baseUrl}/api/members`);
    if (!response.ok) {
      throw new Error('Error al obtener miembros');
    }
    return response.json();
  },

  async getMemberById(id: number): Promise<Member> {
    const response = await fetch(`${baseUrl}/api/members/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener miembro');
    }
    return response.json();
  },

  async getMembershipByMemberId(memberId: number) {
    const response = await fetch(
      `${baseUrl}/api/memberships/member/${memberId}`,
    );
    if (!response.ok) {
      throw new Error('Error al obtener membresía del miembro');
    }
    return response.json();
  },

  async getMembershipPlanById(planId: number): Promise<MembershipPlan> {
    const response = await fetch(`${baseUrl}/api/membership-plans/${planId}`);
    if (!response.ok) {
      throw new Error('Error al obtener plan');
    }
    return response.json();
  },

  async create(data: CreateMemberInput): Promise<Member> {
    const response = await fetch(`${baseUrl}/api/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear miembro');
    }
    return response.json();
  },

  async updateMembership(
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

  async update(id: number, data: UpdateMemberInput): Promise<Member> {
    const response = await fetch(`${baseUrl}/api/members/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar miembro');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/api/members/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar miembro');
    }
  },
};

// import { type Socio } from '../models/Socio';

// const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

// export const socioService = {
//   getAllSocios: async (): Promise<Socio[]> => {
//     const res = await fetch(`${baseUrl}/api/socios`);
//     if(!res.ok) {
//       throw new Error('Error al obtener socios')
//     }
//     return res.json();
//   },

//   createSocio: async (socio: Omit<Socio, 'id'>): Promise<Socio> => {
//     const res = await fetch(`${baseUrl}/api/socios`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(socio),
//     })
//     if (!res.ok) {
//       throw new Error('Error al crear socio')
//     }
//     return res.json()
//   },
// };
