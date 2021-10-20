import { Proposal } from ".";

export interface User {
  id: string;
  displayName?: string;
  firstName: string;
  lastName: string;
  email?: string;
  photo?: string;
  createdAt?: Date;
  tokens?: string[];
  permissions?: string[];
  proposals?: Proposal[];
  //  subscriptions?: Subscription[];
}
