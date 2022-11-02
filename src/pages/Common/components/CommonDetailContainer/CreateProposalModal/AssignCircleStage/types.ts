import { Circle, CommonMemberWithUserInfo } from "@/shared/models";

export interface AssignCircleData {
  circle: Circle;
  commonMember: CommonMemberWithUserInfo;
  description: string;
}
