import axios from "axios";

import {
  PaymentPageCreationData,
  PaymentPageCreationResponse,
} from "../shared/interfaces/api/payMe";
import firebase from "../shared/utils/firebase";
import config from "../config";

const axiosClient = axios.create({
  timeout: 1000000,
});

const endpoints = {
  createPaymentPage: `${config.cloudFunctionUrl}/payments/payme/payin/create-payment-page`,
};

const getFirebaseToken = async (): Promise<string | undefined> => await firebase.auth().currentUser?.getIdToken(true);

export const createPaymentPage = async (creationData: PaymentPageCreationData): Promise<PaymentPageCreationResponse> => {
  const headers = {
    Authorization: await getFirebaseToken(),
  };
  const { data } = await axiosClient.post<PaymentPageCreationResponse>(
    endpoints.createPaymentPage,
    creationData,
    { headers },
  );

  return data;
};
