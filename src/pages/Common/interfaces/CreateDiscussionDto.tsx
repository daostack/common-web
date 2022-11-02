export interface CreateDiscussionDto {
  title: string;
  message: string;
  ownerId: string;
  commonId: string;
  files?: { value: string }[];
  images?: { value: string }[];
  circleVisibility: string[] | null;
}
