import { CommonLink } from "../../Common";

export interface BasicArgsProposal {
  readonly commonId: string;

  readonly proposerId: string;

  title: string;

  description: string;

  images: ProposalImage[];

  files: ProposalFile[];

  links: CommonLink[];
}

export interface ProposalImage {
  title: string;
  value: string;
}

export interface ProposalFile {
  title: string;
  value: string;
}
