import { CommonLink } from "@/shared/models";
import { ProposalImage } from "@/shared/models/governance/proposals";

export type RecipientType = "Member" | "Members" | "Circles" | "3rd Party";

export interface SurveyData {
  title: string;
  description: string;
  links: CommonLink[];
  images: ProposalImage[];
}
