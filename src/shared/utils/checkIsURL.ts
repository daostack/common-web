import { URL_REGEXP } from "@/shared/constants";

export const checkIsURL = (url = ""): boolean => Boolean(url.match(URL_REGEXP));
