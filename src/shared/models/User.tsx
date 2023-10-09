import { Proposal } from ".";

export enum UserRole {
  Trustee = "trustee",
}

export interface User {
  displayName?: string;
  country: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  photo?: string;
  photoURL?: string;
  intro?: string;
  createdAt?: Date;
  updatedAt?: Date;
  proposals?: Proposal[];
  uid: string;
  roles?: UserRole[];
  deleted?: true;
  inboxCounter?: number;
  fcmTokens?: string[];
}
