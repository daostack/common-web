import { CommonLink } from "@/shared/models";

export interface EditDiscussionDto {
  title: string;
  message: string;
  id?: string;
  files?: CommonLink[];
  images?: CommonLink[];
}
