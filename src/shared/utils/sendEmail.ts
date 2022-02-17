
import Api from "../../services/Api";
import { ApiEndpoint } from "../constants";
import { SendEmail } from "../interfaces/SendEmail";

export async function sendEmail(requestData: SendEmail) {
  const { data } = await Api.post<void>(
    ApiEndpoint.SendEmail,
    requestData
  );

  return data;
}
