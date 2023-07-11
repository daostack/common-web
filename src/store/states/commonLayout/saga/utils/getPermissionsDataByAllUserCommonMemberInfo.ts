import { CommonService } from "@/services";
import { Awaited } from "@/shared/interfaces";
import { Governance } from "@/shared/models";

type Return = {
  governance: Governance;
  commonMemberCircleIds: string[];
}[];

export const getPermissionsDataByAllUserCommonMemberInfo = (
  allUserCommonMemberInfo: Awaited<
    ReturnType<typeof CommonService.getAllUserCommonMemberInfo>
  >,
  governanceList: Governance[],
): Return =>
  allUserCommonMemberInfo.reduce<Return>((acc, commonMember) => {
    const governance = governanceList.find(
      (governance) => governance.commonId === commonMember.commonId,
    );

    return governance
      ? acc.concat({
          governance,
          commonMemberCircleIds: commonMember.circleIds,
        })
      : acc;
  }, []);
