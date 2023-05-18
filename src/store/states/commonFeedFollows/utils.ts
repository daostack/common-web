export function getFollowFeedItemMutationId(
  commonId: string,
  feedItemId: string,
) {
  return `${commonId}-${feedItemId}`;
}
