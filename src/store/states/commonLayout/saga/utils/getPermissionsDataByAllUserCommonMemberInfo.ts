import { Governance, UserMemberships } from "@/shared/models";

type Return = {
  governance: Pick<Governance, "commonId" | "circles">;
  commonMemberCircleIds: string[];
}[];

export const getPermissionsDataByAllUserCommonMemberInfo = (
  userMemberships: UserMemberships["commons"],
  governanceList: Pick<Governance, "commonId" | "circles">[],
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
