export enum ROUTE_PATHS {
  HOME = "/",
  CONTACT_US = "/contact-us",
  MY_ACCOUNT = "/my-account",
  MY_ACCOUNT_PROFILE = "/my-account/profile",
  MY_ACCOUNT_ACTIVITIES = "/my-account/activities",
  MY_ACCOUNT_ACTIVITIES_PROPOSALS = "/my-account/activities/proposals/:proposalType",
  MY_ACCOUNT_ACTIVITIES_COMMONS = "/my-account/activities/commons",
  MY_ACCOUNT_BILLING = "/my-account/billing",
  COMMON_LIST = "/commons",
  COMMON_DETAIL = "/commons/:id",
  SUPPORTERS = "/commons/:id/supporters",
  MY_COMMONS = "/my-commons",
  SUBMIT_INVOICES = "/invoices/submission/:proposalId",
  TRUSTEE = "/trustee",
  TRUSTEE_AUTH = "/trustee/auth",
  TRUSTEE_INVOICES = "/trustee/invoices",
  TRUSTEE_INVOICE = "/trustee/invoices/:proposalId",
  PROPOSAL_DETAIL = "/proposals/:id",
  PROPOSAL_COMMENT = "/proposal-comments/:id",
  DISCUSSION_DETAIL = "/discussions/:id",
  DISCUSSION_MESSAGE = "/discussion-messages/:id",
}
