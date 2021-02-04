import { Permission } from "./Permission";

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];

  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
}
