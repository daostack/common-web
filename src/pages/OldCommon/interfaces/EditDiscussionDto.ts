import { CommonLink } from "@/shared/models";

export interface EditDiscussionDto {
  id: string;
  title: string;
  message: string;
  files?: CommonLink[];
  images?: CommonLink[];
}
