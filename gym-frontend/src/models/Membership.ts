export type Membership = {
  id: number;
  memberId: number;
  membershipPlanId: number;
  startDate: string;
  endDate: string;
  lastPaymentMethod?:
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'TRANSFER'
    | 'CASH'
    | 'OTHER';
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
};
