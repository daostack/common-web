export interface ApproveOrDeclineProposalDto {
  proposalId: string;
  approved: boolean;
  declineReason?: string;
}
