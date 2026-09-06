export type MembershipStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
export type MembershipStatusBadgeVariant = 'default' | 'outline' | 'destructive';

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

export const MEMBERSHIP_STATUS = [
  { id: 'ACTIVE', label: 'Activa', variant: 'default' },
  { id: 'CANCELLED', label: 'Cancelada', variant: 'destructive' },
  { id: 'EXPIRED', label: 'Vencida', variant: 'outline' },
] as const satisfies ReadonlyArray<{
  id: MembershipStatus;
  label: string;
  variant: MembershipStatusBadgeVariant;
}>;
