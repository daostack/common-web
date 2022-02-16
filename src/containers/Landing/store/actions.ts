import { PayloadWithCallback } from "@/shared/interfaces";
import { SendEmail } from "@/shared/interfaces/SendEmail";
import { createAsyncAction } from "typesafe-actions";
import { LandingActionTypes } from "./constants";

export const sendEmail = createAsyncAction(
  LandingActionTypes.SEND_EMAIL,
  LandingActionTypes.SEND_EMAIL_SUCCESS,
  LandingActionTypes.SEND_EMAIL_FAILURE
)<PayloadWithCallback<SendEmail, void, Error>, void, Error>();
