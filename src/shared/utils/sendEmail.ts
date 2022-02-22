
import Api from "../../services/Api";
import { ApiEndpoint } from "../constants";
import { SendEmail } from "../interfaces/SendEmail";

export async function sendEmail(requestData: SendEmail) {
  await Api.post(ApiEndpoint.SendEmail, requestData);
}
