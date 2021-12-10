import axios from "axios";

import getFirebaseToken from "../helpers/getFirebaseToken";
import { PaymentPageCreationData } from "../shared/interfaces/api/payMe";
import { CommonPayment } from "../shared/models";
import config from "../config";

const axiosClient = axios.create({
  timeout: 1000000,
});

const endpoints = {
  createPaymentPage: `${config.cloudFunctionUrl}/payments/payme/payin/create-payment-page`,
};

const createPaymentPage = async (creationData: PaymentPageCreationData): Promise<CommonPayment> => {
  const headers = {
    Authorization: await getFirebaseToken(),
  };
  const { data } = await axiosClient.post<CommonPayment>(
    endpoints.createPaymentPage,
    creationData,
    { headers },
  );

  return data;
};

export default {
  createPaymentPage,
};
