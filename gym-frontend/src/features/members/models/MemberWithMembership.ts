import type { Member } from './Member';

export type MembershipPlanInfo = {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type MembershipInfo = {
  id: number;
  status: string;
  membershipPlan: MembershipPlanInfo;
  endDate: string;
} | null;

export type MemberWithMembership = Member & {
  membership: MembershipInfo;
};
