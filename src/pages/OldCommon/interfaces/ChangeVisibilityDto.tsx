import { EntityTypes } from "@/shared/constants";

export interface ChangeVisibilityDto {
  itemId: string;
  commonId: string;
  userId: string;
  type: EntityTypes;
}
