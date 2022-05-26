import { CommonLink } from "../../Common";

export interface BasicArgsProposal {
  readonly commonId: string;

  readonly proposerId: string;

  title: string;

  description: string;

  images: ProposalImges[];

  files: ProposalFiles[];

  links: CommonLink[];
}

export interface ProposalImges {
  title: string;
  value: string;
}

export interface ProposalFiles {
  title: string;
  value: string;
}
