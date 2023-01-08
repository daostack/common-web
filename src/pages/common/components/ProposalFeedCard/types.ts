import { Common, User } from "@/shared/models";

export interface ProposalSpecificData {
  targetUser: User | null;
  targetCommon: Common | null;
}
