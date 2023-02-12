export enum ProposalsTypes {
  MEMBER_ADMITTANCE = "MEMBER_ADMITTANCE",
  // MEMBER_EXPULSION = "MEMBER_EXPULSION",

  FUNDS_ALLOCATION = "FUNDS_ALLOCATION",

  // ADD_UNSTRUCTURED_RULE = "ADD_RULE",
  // UPDATE_UNSTRUCTURED_RULE = "UPDATE_RULE",
  // DELETE_UNSTRUCTURED_RULE = "DELETE_RULE",

  // ADD_PROPOSAL_RULE = "ADD_PROPOSAL_RULE",
  // UPDATE_PROPOSAL_RULE = "UPDATE_PROPOSAL_RULE",
  // DELETE_PROPOSAL_RULE = "DELETE_PROPOSAL_RULE",

  FUNDS_REQUEST = "FUNDS_REQUEST",
  // UPDATE_FUNDS_REQUEST = "UPDATE_FUNDS_REQUEST",

  // CREATE_CIRCLE = "CREATE_NEW_CIRCLE",
  // UPDATE_CIRCLE = "UPDATE_CIRCLE",
  // DELETE_CIRCLE = "DELETE_CIRCLE",

  ASSIGN_CIRCLE = "ASSIGN_CIRCLE",
  REMOVE_CIRCLE = "REMOVE_CIRCLE",
  SURVEY = "SURVEY",

  DELETE_COMMON = "DELETE_COMMON",

  // DELETE_DISCUSSION = "DELETE_DISCUSSION",
}

export interface ProposalTypeSelectOption {
  label: string;
  value: ProposalsTypes;
}

export const PROPOSAL_TYPE_SELECT_OPTIONS = [
  {
    label: "Survey",
    value: ProposalsTypes.SURVEY,
  },
  // TODO: Add in future tickets
  // {
  //   label: "Fund allocation",
  //   value: ProposalsTypes.FUNDS_ALLOCATION,
  // },
  // {
  //   label: "Assign members to a circle",
  //   value: ProposalsTypes.ASSIGN_CIRCLE,
  // },
  // {
  //   label: "Remove members from a circle",
  //   value: ProposalsTypes.REMOVE_CIRCLE,
  // },
  // {
  //   label: "Delete common",
  //   value: ProposalsTypes.DELETE_COMMON,
  // },
];
