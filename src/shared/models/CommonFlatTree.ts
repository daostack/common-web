import { BaseEntity } from "./BaseEntity";
import { Common, CommonState } from "./Common";
import { Governance } from "./governance";

interface CommonProperties {
  id: string;
  name: string;
  image?: string;
  circles: Governance["circles"];
  state: CommonState;
  listVisibility?: Common["listVisibility"];
}

export interface CommonFlatTree extends BaseEntity, CommonProperties {
  spaces: Record<string, CommonProperties & { parentId: string }>;
}
