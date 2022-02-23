
import Api from "../../services/Api";
import { ApiEndpoint } from "../constants";
import { SendEmail } from "../interfaces/SendEmail";

export async function sendEmail(requestData: SendEmail): Promise<void> {
  await Api.post(ApiEndpoint.SendEmail, requestData);
}
