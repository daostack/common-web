export interface AddMessageToDiscussionDto {
  text: string;
  createTime: Date;
  ownerId: string;
  commonId: string;
  discussionId: string;
}

export interface AddMessageToProposalDto {
  text: string;
  createTime: Date;
  ownerId: string;
  commonId: string;
  proposalId: string;
}
