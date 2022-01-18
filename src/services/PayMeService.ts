import axios from "axios";

import getFirebaseToken from "../helpers/getFirebaseToken";
import { BuyerTokenPageCreationData } from "../shared/interfaces/api/payMe";
import { CommonPayment } from "../shared/models";
import config from "../config";
import { AXIOS_TIMEOUT } from "../shared/constants";

const axiosClient = axios.create({
  timeout: AXIOS_TIMEOUT,
});

const endpoints = {
  createBuyerTokenPage: `${config.cloudFunctionUrl}/payments/payme/payin/create-buyer-token-page`,
};

const createBuyerTokenPage = async (
  creationData: BuyerTokenPageCreationData
): Promise<CommonPayment> => {
  const headers = {
    Authorization: await getFirebaseToken(),
  };
  const { data } = await axiosClient.post<CommonPayment>(
    endpoints.createBuyerTokenPage,
    creationData,
    { headers }
  );

  return data;
};

export default {
  createBuyerTokenPage,
};
