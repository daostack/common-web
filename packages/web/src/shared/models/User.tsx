import { Role } from "./Role";

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password_hash: string;
  id?: number;
  address?: string;
  birthday?: string;
  roles?: Role[];
  is_active: boolean;
}
