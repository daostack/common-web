export const getFeedItemUserMetadataKey = (info: {
  commonId: string;
  userId: string;
  feedObjectId: string;
}): string => `${info.commonId}_${info.userId}_${info.feedObjectId}`;
