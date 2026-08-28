export type PaymentMethod =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'TRANSFER'
  | 'CASH'
  | 'OTHER';

export type Membership = {
  id: number;
  memberId: number;
  membershipPlanId: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELED';
  lastPaymentMethod?: PaymentMethod | null;
  lastPaymentDate?: string | null;
  lastPaymentAmount?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
