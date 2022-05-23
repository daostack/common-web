import { CommonLink } from "../../Common";

export interface BasicArgsProposal {
  readonly commonId: string;

  readonly proposerId: string;

  title: string;

  description: string;

  images: string[];

  files: string[];

  links: CommonLink[];
}
