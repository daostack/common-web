import { Governance, UserMemberships } from "@/shared/models";

type Return = {
  governance: Governance;
  commonMemberCircleIds: string[];
}[];

export const getPermissionsDataByAllUserCommonMemberInfo = (
  userMemberships: UserMemberships["commons"],
  governanceList: Governance[],
): Return =>
  Object.entries(userMemberships).reduce<Return>(
    (acc, [commonId, { circleIds }]) => {
      const governance = governanceList.find(
        (governance) => governance.commonId === commonId,
      );

      return governance
        ? acc.concat({
            governance,
            commonMemberCircleIds: circleIds,
          })
        : acc;
    },
    [],
  );
