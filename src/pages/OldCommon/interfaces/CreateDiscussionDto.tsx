import { CommonLink } from "@/shared/models";

export interface CreateDiscussionDto {
  id: string;
  title: string;
  message: string;
  ownerId: string;
  commonId: string;
  files?: CommonLink[];
  images?: CommonLink[];
  circleVisibility: string[] | null;
}
