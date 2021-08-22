import { Proposal } from ".";

export interface User {
  uid: string;
  displayName?: string;
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
  //  subscriptions?: Subscription[];
}
