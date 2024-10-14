import { CommonLink } from "../../Common";

export interface BasicArgsProposal {
  id: string;
  
  discussionId: string;

  readonly commonId: string;

  readonly proposerId: string;

  title: string;

  description: string;

  images: CommonLink[];

  files: CommonLink[];

  links: CommonLink[];

  circleVisibility?: string[] | null;
}

export interface ProposalImage {
  title: string;
  value: string;
}

export interface ProposalFile {
  title: string;
  value: string;
}
