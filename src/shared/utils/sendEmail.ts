
import Api from "../../services/Api";
import { ApiEndpoint } from "../constants";
import { SendEmail } from "../interfaces/SendEmail";

export async function sendEmail(requestData: SendEmail) {
  // TODO: need to check the return data and decide if we need it or not
  const { data } = await Api.post(
    ApiEndpoint.SendEmail,
    requestData
  );

  return data;
}
