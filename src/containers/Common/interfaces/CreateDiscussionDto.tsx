export interface CreateDiscussionDto {
  title: string;
  message: string;
  createTime: Date;
  lastMessage: Date;
  ownerId: string;
  commonId: string;
}
