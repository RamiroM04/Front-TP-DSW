export type MembershipStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export type Membership = {
  id: number;
  memberId: number;
  membershipPlanId: number;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
