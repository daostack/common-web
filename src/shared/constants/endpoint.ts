export const ApiEndpoint = {
  GovernanceCreate: "/governance/create",
  GovernanceUpdateRules: "/governance/updateRules",
  GovernanceUpdateCircleName: "/governance/circle-name",
  GovernanceUpdateCircles: "/governance/update-circles",
  GovernancePreviewCirclesUpdate: "/governance/preview-circles-update",
  AddFounderToMembers: "/commons/add-founder-to-members",
  CreateCommon: "/commons/create",
  UpdateCommon: "/commons/update",
  CreateSubCommon: "/commons/subcommon/create",
  MarkCommonSeenForUser: "/commons/mark-seen-for-user",
  MarkFeedObjectSeenForUser: "/commons/mark-feed-object-seen-for-user",
  MarkFeedObjectUnseenForUser: "/commons/mark-feed-object-unseen-for-user",
  LinkStream: "/commons/link-stream",
  UnlinkStream: "/commons/unlink-stream",
  MoveStream: "/commons/move-stream",
  AcceptRules: "/commons/accept-rules",
  GetCommonFeedItems: "/commons/:commonId/feed-items",
  GetCommonPinnedFeedItems: "/commons/:commonId/pinned-feed-items",
  CreateAction: "/proposals/action",
  CreateProposal: "/proposals/create",
  VoteProposal: "/proposals/vote",
  UpdateVote: "/proposals/vote",
  DeleteProposal: (id: string) => `/proposals/${id}`,
  MakeImmediateContribution: "/commons/immediate-contribution",
  AddBankAccount: "/payments/bank-account-details/add",
  UpdateBankAccount: "/payments/bank-account-details/update",
  DeleteBankAccount: "/payments/bank-account-details/delete",
  GetBankAccount: "/payments/bank-account-details/get",
  UploadInvoices: "/payments/payout-docs/add",
  ApproveOrDeclineProposal: "/payments/payout-docs/trustee-decision",
  GetReports: "/reports",
  CreateReport: "/moderation/report",
  HideContent: "/moderation/hide",
  ShowContent: "/moderation/show",
  FollowCommon: "/commons/follow",
  MuteCommon: "/commons/mute",
  LeaveCommon: "/commons/leave",
  CreateSubscription: "/commons/immediate-contribution",
  AddNotionIntegration: "commons/notion/setup",
  RemoveNotionIntegration: "commons/notion/remove",
  UpdateSubscription: "/subscriptions/update",
  CancelSubscription: "/subscriptions/cancel",
  CreateUser: "/users/create",
  UpdateUser: "/users/update",
  DeleteUser: "/users/delete",
  FollowFeedItem: "/users/follow-feed-item",
  GetInbox: "/users/inbox",
  SendEmail: "/notifications/send-email",
  SeenNotification: "/notifications/seen",
  CreateDiscussion: "/discussions/create",
  EditDiscussion: "/discussions/edit",
  DeleteDiscussion: (id: string) => `/discussions/delete/${id}`,
  CreateDiscussionMessage: "/discussions/message",
  DeleteDiscussionMessage: "/discussions/delete",
  CreateDiscussionMessageReaction: "/discussions/create-message-reaction",
  DeleteDiscussionMessageReaction: "/discussions/delete-message-reaction",
  GetProposalEligibleVoters:
    "/proposals/get-all-eligible-proposal-voters/:proposalId",
  GetDMUsers: "/chat/users",
  CreateChatChannel: "/chat/channel",
  GetChatChannelMessages: (channelId: string) =>
    `/chat/channel/${channelId}/messages`,
  SendChatMessage: (channelId: string) => `/chat/${channelId}/message`,
  UpdateChatMessage: (chatMessageId: string) =>
    `/chat/message/${chatMessageId}`,
  DeleteChatMessage: (chatMessageId: string) =>
    `/chat/message/${chatMessageId}`,
  MarkChatChannelAsSeen: (channelId: string) =>
    `/chat/channel/${channelId}/seen`,
  MarkChatChannelAsUnseen: (channelId: string) =>
    `/chat/channel/${channelId}/unseen`,
  MarkChatMessageAsSeen: (chatMessageId: string) =>
    `/chat/message/${chatMessageId}/seen`,
  CreateChatMessageReaction: "/chat/create-message-reaction",
  DeleteChatMessageReaction: "/chat/delete-message-reaction",
  GetOGLinkMetadata: "/metadata/og-link",
};
