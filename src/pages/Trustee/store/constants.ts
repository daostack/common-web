export enum TrusteeActionTypes {
  GET_PENDING_APPROVAL_PROPOSALS = "@TRUSTEE/GET_PENDING_APPROVAL_PROPOSALS",
  GET_PENDING_APPROVAL_PROPOSALS_SUCCESS = "@TRUSTEE/GET_PENDING_APPROVAL_PROPOSALS_SUCCESS",
  GET_PENDING_APPROVAL_PROPOSALS_FAILURE = "@TRUSTEE/GET_PENDING_APPROVAL_PROPOSALS_FAILURE",

  GET_APPROVED_PROPOSALS = "@TRUSTEE/GET_APPROVED_PROPOSALS",
  GET_APPROVED_PROPOSALS_SUCCESS = "@TRUSTEE/GET_APPROVED_PROPOSALS_SUCCESS",
  GET_APPROVED_PROPOSALS_FAILURE = "@TRUSTEE/GET_APPROVED_PROPOSALS_FAILURE",

  GET_DECLINED_PROPOSALS = "@TRUSTEE/GET_DECLINED_PROPOSALS",
  GET_DECLINED_PROPOSALS_SUCCESS = "@TRUSTEE/GET_DECLINED_PROPOSALS_SUCCESS",
  GET_DECLINED_PROPOSALS_FAILURE = "@TRUSTEE/GET_DECLINED_PROPOSALS_FAILURE",

  GET_PROPOSALS_DATA = "@TRUSTEE/GET_PROPOSALS_DATA",
  GET_PROPOSALS_DATA_SUCCESS = "@TRUSTEE/GET_PROPOSALS_DATA_SUCCESS",
  GET_PROPOSALS_DATA_FAILURE = "@TRUSTEE/GET_PROPOSALS_DATA_FAILURE",

  UPDATE_PROPOSALS_DATA = "@TRUSTEE/UPDATE_PROPOSALS_DATA",

  CLEAR_PROPOSALS = "@TRUSTEE/CLEAR_PROPOSALS",

  GET_PROPOSAL_FOR_APPROVAL = "@TRUSTEE/GET_PROPOSAL_FOR_APPROVAL",
  GET_PROPOSAL_FOR_APPROVAL_SUCCESS = "@TRUSTEE/GET_PROPOSAL_FOR_APPROVAL_SUCCESS",
  GET_PROPOSAL_FOR_APPROVAL_FAILURE = "@TRUSTEE/GET_PROPOSAL_FOR_APPROVAL_FAILURE",

  CLEAR_PROPOSAL_FOR_APPROVAL = "@TRUSTEE/CLEAR_PROPOSAL_FOR_APPROVAL",

  APPROVE_OR_DECLINE_PROPOSAL = "@TRUSTEE/APPROVE_OR_DECLINE_PROPOSAL",
  APPROVE_OR_DECLINE_PROPOSAL_SUCCESS = "@TRUSTEE/APPROVE_OR_DECLINE_PROPOSAL_SUCCESS",
  APPROVE_OR_DECLINE_PROPOSAL_FAILURE = "@TRUSTEE/APPROVE_OR_DECLINE_PROPOSAL_FAILURE",
}
