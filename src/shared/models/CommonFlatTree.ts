import { BaseEntity } from "./BaseEntity";
import { CommonState } from "./Common";

interface CommonProperties {
  id: string;
  name: string;
  state: CommonState;
  image?: string;
}

export interface CommonFlatTree extends BaseEntity, CommonProperties {
  spaces: Record<string, CommonProperties & { parentId: string }>;
}
