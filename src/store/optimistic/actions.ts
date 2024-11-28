export const removeOptimisticDiscussionMessage = createAction(
  'optimistic/REMOVE_OPTIMISTIC_DISCUSSION_MESSAGE',
  (payload: { messageId: string; commonId: string }) => ({
    payload,
  }),
); 