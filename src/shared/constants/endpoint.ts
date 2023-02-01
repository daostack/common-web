export const ApiEndpoint = {
  GovernanceCreate: "/governance/create",
  GovernanceUpdateRules: "/governance/updateRules",
  AddFounderToMembers: "/commons/add-founder-to-members",
  CreateCommon: "/commons/create",
  UpdateCommon: "/commons/update",
  CreateSubCommon: "/commons/subcommon/create",
  CreateAction: "/proposals/action",
  CreateProposal: "/proposals/create",
  VoteProposal: "/proposals/vote",
  UpdateVote: "/proposals/vote",
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
  LeaveCommon: "/commons/leave",
  CreateSubscription: "/commons/immediate-contribution",
  UpdateSubscription: "/subscriptions/update",
  CancelSubscription: "/subscriptions/cancel",
  CreateUser: "/users/create",
  DeleteUser: "/users/delete",
  SendEmail: "/notifications/send-email",
  SeenNotification: "/notifications/seen",
  CreateDiscussion: "/discussions/create",
  CreateDiscussionMessage: "/discussions/message",
  DeleteDiscussionMessage: "/discussions/delete",
  EligibleVoters: "/proposals/get-all-eligible-proposal-voters",
};
