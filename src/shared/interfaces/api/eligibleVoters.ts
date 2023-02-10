import { EligibleVoter } from "@/shared/models";

export interface EligibleVotersApiResponse {
  data: EligibleVoter[];
  message: string;
}
