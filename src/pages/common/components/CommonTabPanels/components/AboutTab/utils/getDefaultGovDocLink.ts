import { Common } from "@/shared/models";
import { checkIsProject } from "@/shared/utils";
import {
  COMMON_GOVERNANCE_DOC_URL,
  PROJECT_GOVERNANCE_DOC_URL,
} from "../constants";

export const getDefaultGovDocUrl = (common?: Common | null) =>
  checkIsProject(common)
    ? PROJECT_GOVERNANCE_DOC_URL
    : COMMON_GOVERNANCE_DOC_URL;
