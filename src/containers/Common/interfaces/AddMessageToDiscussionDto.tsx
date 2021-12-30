export interface AddMessageToDiscussionDto {
  text: string;
  createTime: Date;
  ownerId: string;
  commonId: string;
  discussionId: string;
}
