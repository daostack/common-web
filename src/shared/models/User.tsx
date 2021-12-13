import { Proposal } from ".";

export interface User {
  id: string;
  displayName?: string;
  country: string;
  firstName: string;
  lastName: string;
  email?: string;
  photo?: string;
  photoURL?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  tokens?: string[];
  permissions?: string[];
  proposals?: Proposal[];
  uid?: string;
  //  subscriptions?: Subscription[];
}
