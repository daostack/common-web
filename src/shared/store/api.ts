import { FIREBASE_SHORT_DYNAMIC_LINKS_URL } from "@/config";
import GeneralApi from "@/services/GeneralApi";
import {
  DynamicLinkInfo,
  DynamicLinkResponse,
} from "../interfaces/api/dynamicLink";

export async function buildShareLink(
  dynamicLinkInfo: DynamicLinkInfo
): Promise<string> {
  const { data } = await GeneralApi.post<DynamicLinkResponse>(
    FIREBASE_SHORT_DYNAMIC_LINKS_URL,
    {
      dynamicLinkInfo,
    }
  );

  return data.shortLink;
}
