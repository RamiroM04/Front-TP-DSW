export type MembershipPlan = {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateMembershipPlanInput = Omit<
  MembershipPlan,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UpdateMembershipPlanInput = Partial<
  Omit<MembershipPlan, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;
