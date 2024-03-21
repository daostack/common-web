import { BaseEntity } from "./BaseEntity";
import { Common, CommonState } from "./Common";

interface CommonProperties {
  id: string;
  name: string;
  image?: string;
  state: CommonState;
  listVisibility: Common["listVisibility"] | undefined;
}

export interface CommonFlatTree extends BaseEntity, CommonProperties {
  spaces: Record<string, CommonProperties & { parentId: string }>;
}
