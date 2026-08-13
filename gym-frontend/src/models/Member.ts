export type Status = 'Activo' | 'Inactivo';
export type Role = 'Basico' | 'Plus' | 'Premium';
export type DocType = 'DNI' | 'PASAPORTE';
// Este type esta siendo utilizado por el mockMembers.ts y por la pagina de SociosPage1.tsx
// TODO: Unificar con el Socio model y controlar consistencia con el backend

export type Member = {
  id: number;
  name: string;
  surname: string;
  docType: DocType;
  docNumber: string;
  birthDate: string;
  //initials: string;
  //avatar: string;
  email: string;
  phone: string | null;
  status: Status;
  plan: Role;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  nextExpiration?: string;
};

export type CreateMemberInput = Omit<
  Member,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type UpdateMemberInput = Partial<
  Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;
