import { Common, CommonMember, Governance } from "@/shared/models";

export interface UserMembershipInfo {
  common: Common;
  governance: Governance;
  commonMember: CommonMember;
}
