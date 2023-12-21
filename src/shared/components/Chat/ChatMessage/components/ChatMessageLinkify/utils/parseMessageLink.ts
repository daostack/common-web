import { parse } from "query-string";
import { BASE_URL, ROUTE_PATHS } from "@/shared/constants";
import { matchOneOfRoutes } from "@/shared/utils";

export interface ParseMessageLinkData {
  pathname: string;
  params: Record<string, string>;
}

export const parseMessageLink = (url?: string): ParseMessageLinkData | null => {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.origin !== BASE_URL ||
      !matchOneOfRoutes(parsedUrl.pathname, [
        ROUTE_PATHS.COMMON,
        ROUTE_PATHS.V04_COMMON,
      ])
    ) {
      return null;
    }

    return {
      pathname: parsedUrl.pathname,
      params: Object.entries(parse(parsedUrl.search)).reduce(
        (acc, [key, value]) =>
          typeof value === "string"
            ? {
                ...acc,
                [key]: value,
              }
            : acc,
        {},
      ),
    };
  } catch (err) {
    return null;
  }
};
