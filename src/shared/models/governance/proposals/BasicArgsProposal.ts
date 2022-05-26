import { CommonLink } from "../../Common";

export interface BasicArgsProposal {
  readonly commonId: string;

  readonly proposerId: string;

  title: string;

  description: string;

  images: { title: string, value: string }[]

  files: { title: string, value: string }[]

  links: CommonLink[];
}
