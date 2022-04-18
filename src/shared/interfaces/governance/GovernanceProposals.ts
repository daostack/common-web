export enum GovernanceProposals {
  MemberAdmittance = 'MEMBER_ADMITTANCE',
  MemberExpulsion = 'MEMBER_EXPULSION',

  FundsAllocation = 'FUNDS_ALLOCATION',

  AddUnstructuredRule = 'ADD_RULE',
  UpdateUnstructuredRule = 'UPDATE_RULE',
  DeleteUnstructuredRule = 'DELETE_RULE',

  AddProposalRule = 'ADD_PROPOSAL_RULE',
  UpdateProposalRule = 'UPDATE_PROPOSAL_RULE',
  DeleteProposalRule = 'DELETE_PROPOSAL_RULE',

  AddFundsContribution = 'ADD_FUNDS_CONTRIBUTION',
  UpdateFundsContribution = 'UPDATE_FUNDS_CONTRIBUTION',

  CreateAttribute = 'CREATE_NEW_ATTRIBUTE',
  UpdateAttribute = 'UPDATE_ATTRIBUTE',
  DeleteAttribute = 'DELETE_ATTRIBUTE',

  AssignAttributeToMember = 'ASSIGN_ATTRIBUTE_TO_MEMBER',
  RemoveAttributeFromMember = 'REMOVE_ATTRIBUTE_FROM_MEMBER',

  DeleteDiscussion = 'DELETE_DISCUSSION',
}
