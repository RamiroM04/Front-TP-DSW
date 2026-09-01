import type { Member } from './Member';

export type ExtendedMember = Member & {
  plan: string;
  nextExpiration: string;
};
