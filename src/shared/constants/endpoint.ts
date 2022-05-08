export const ApiEndpoint = {
  CreateCommon: "/commons/create",
  MakeImmediateContribution: "/commons/immediate-contribution",
  CreateRequestToJoin: "/proposals/create/join",
  CreateFunding: "/proposals/create/funding",
  AddBankAccount: "/payments/bank-account-details/add",
  UpdateBankAccount: "/payments/bank-account-details/update",
  GetBankAccount: "/payments/bank-account-details/get",
  CreateVote: "/proposals/create/vote",
  UpdateVote: "/proposals/update/vote",
  UploadInvoices: "/payments/payout-docs/add",
  ApproveOrDeclineProposal: "/payments/payout-docs/trustee-decision",
  GetReports: "/reports",
  LeaveCommon: "/commons/leave",
  UpdateSubscription: "/subscriptions/update",
  CancelSubscription: "/subscriptions/cancel",
  DeleteCommon: "/commons/deactivate",
  CreateUser: "/users/create",
  SendEmail: "/notifications/send-email",
};
