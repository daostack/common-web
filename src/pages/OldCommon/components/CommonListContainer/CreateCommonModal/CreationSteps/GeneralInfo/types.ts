import { CommonLink } from "@/shared/models";

export interface MainInfoValues {
  commonName: string;
  tagline: string;
  about: string;
  links: CommonLink[];
}
