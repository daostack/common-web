import config from "../../config";
import { ApiEndpoint } from "../constants/endpoint";

export const getReportsDownloadURL = (): string =>
  `${config.cloudFunctionUrl}${ApiEndpoint.GetReports}`;
