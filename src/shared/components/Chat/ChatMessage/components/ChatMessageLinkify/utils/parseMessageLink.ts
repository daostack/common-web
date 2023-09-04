import { parse, ParsedQuery } from "query-string";
import { BASE_URL } from "@/shared/constants";

export interface ParseMessageLinkData {
  pathname: string;
  params: ParsedQuery;
}

export const parseMessageLink = (url: string): ParseMessageLinkData | null => {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.origin !== BASE_URL) {
      return null;
    }

    return {
      pathname: parsedUrl.pathname,
      params: parse(parsedUrl.search),
    };
  } catch (err) {
    return null;
  }
};
