export const getCommonMemberStateKey = (info: {
  userId: string;
  commonId: string;
}): string => `${info.userId}_${info.commonId}`;
