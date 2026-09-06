import type { Member } from './Member';
import type { MembershipStatus } from '@/features/memberships/models/Membership';

export type ExtendedMember = Member & {
  plan: string;
  nextExpiration: string;
  membershipStatus?: MembershipStatus | 'INACTIVE';
};
