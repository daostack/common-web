export enum ROUTE_PATHS {
  HOME = "/",
  CONTACT_US = "/contact-us",
  MY_ACCOUNT = "/my-account",
  PROFILE = "/profile",
  BILLING = "/billing",
  WALLET = "/wallet",
  MY_ACCOUNT_ACTIVITIES = "/my-account/activities",
  MY_ACCOUNT_ACTIVITIES_PROPOSALS = "/my-account/activities/proposals/:proposalType",
  MY_ACCOUNT_ACTIVITIES_COMMONS = "/my-account/activities/commons",
  COMMON_LIST = "/commons",
  COMMON_DETAIL = "/commons/:id",
  COMMON_SUPPORT = "/commons/:id/support",
  COMMON = "/new-commons/:id",
  PROJECT_CREATION = "/new-commons/:id/new-project",
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
  DEAD_SEA = "/dead-sea",
  PARENTS_FOR_CLIMATE = "/parents-for-climate",
  SAVE_SAADIA = "/save-saadia",
}
