import { Circle, CommonMemberWithUserInfo } from "@/shared/models";

export interface RemoveCircleData {
  circle: Circle;
  commonMember: CommonMemberWithUserInfo;
}
