import { Proposal } from ".";

export enum UserRole {
  Trustee = "trustee",
}

export interface User {
  id: string;
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
  lastLoginAt?: Date;
  permissions?: string[];
  proposals?: Proposal[];
  uid?: string;
  roles?: UserRole[];
  deleted?: true;
  //  subscriptions?: Subscription[];
}
