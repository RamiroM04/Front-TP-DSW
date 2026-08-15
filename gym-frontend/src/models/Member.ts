export type Status = 'ACTIVE' | 'INACTIVE';
export type DocType = 'DNI' | 'PASAPORTE';

export type Member = {
  id: number;
  name: string;
  surname: string;
  docType: DocType;
  docNumber: string;
  birthDate: string;
  email: string;
  phone: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  nextExpiration?: string;
};

export type CreateMemberInput = {
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  docType: DocType;
  docNumber: string;
  birthDate: string;
  status: Status;
  membershipPlanId: number;
};
export type UpdateMemberInput = Partial<
  Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;
