import { CommonLink } from "../../Common";

export interface BasicArgsProposal {
  readonly commonId: string;

  readonly proposerId: string;

  title: string;

  description: string;

  images: CommonLink[];

  files: CommonLink[];

  links: CommonLink[];

  circleVisibilityByCommon?: Record<string, string[]> | null;
}

export interface ProposalImage {
  title: string;
  value: string;
}

export interface ProposalFile {
  title: string;
  value: string;
}
