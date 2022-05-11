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
  photo?: string;
  photoURL?: string;
  intro?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  tokens?: string[];
  permissions?: string[];
  proposals?: Proposal[];
  uid?: string;
  roles?: UserRole[];
  //  subscriptions?: Subscription[];
}
