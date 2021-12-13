import axios from "axios";

import getFirebaseToken from "../helpers/getFirebaseToken";
import {
  PaymentPageCreationBaseData,
  PaymentPageCreationDataWithCharging,
  PaymentPageCreationDataWithoutCharging,
} from "../shared/interfaces/api/payMe";
import { CommonPayment } from "../shared/models";
import config from "../config";

const axiosClient = axios.create({
  timeout: 1000000,
});

const endpoints = {
  createPaymentPage: `${config.cloudFunctionUrl}/payments/payme/payin/create-payment-page`,
};

const createPaymentPage = async (
  creationData:
    | PaymentPageCreationDataWithCharging
    | PaymentPageCreationDataWithoutCharging
): Promise<CommonPayment> => {
  const headers = {
    Authorization: await getFirebaseToken(),
  };
  const { data } = await axiosClient.post<CommonPayment>(
    endpoints.createPaymentPage,
    creationData,
    { headers }
  );

  return data;
};

const createPaymentPageWithoutCharging = async (
  creationData: PaymentPageCreationBaseData
): Promise<CommonPayment> => {
  const data: PaymentPageCreationDataWithoutCharging = {
    ...creationData,
    sale_type: "token",
  };

  return createPaymentPage(data);
};

export default {
  createPaymentPageWithoutCharging,
};
