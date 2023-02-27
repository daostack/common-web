import { Common } from "@/shared/models";
import { checkIsProject } from "@/shared/utils";

const COMMON_GOVERNANCE_DOC_URL =
  "https://drive.google.com/file/d/1ZTA-ekZmQRboKpPY7S1oRW32Suttl3uz/view?usp=sharing";
const PROJECT_GOVERNANCE_DOC_URL =
  "https://drive.google.com/file/d/1AEqkjCyRbJJHq2jRTpgmu1Q9Y5Fn6LiM/view?usp=sharing";

export const getDefaultGovDocUrl = (common?: Common | null) =>
  checkIsProject(common)
    ? PROJECT_GOVERNANCE_DOC_URL
    : COMMON_GOVERNANCE_DOC_URL;
