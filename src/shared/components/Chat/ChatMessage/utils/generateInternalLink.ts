import { BASE_URL } from "@/shared/constants";
import { getCommonPagePath } from "@/shared/utils";
import {
  getCommon,
  handleCommonClick,
  renderLink
} from "./getTextFromSystemMessage";
import { Text } from "@/shared/models";

export const generateInternalLink = async (text: string): Promise<Text> => {
  const commonId = text.split("/").pop();
  if (text.startsWith(BASE_URL) && commonId) {
    const common = await getCommon(commonId);
    if (common?.id && common.name) {
      return renderLink(getCommonPagePath(common?.id), common.name, () =>
        handleCommonClick(common?.id, common?.rootCommonId),
      );
    }
  }

  return text;
}