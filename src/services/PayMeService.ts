import axios from "axios";
import { AXIOS_TIMEOUT } from "@/shared/constants";
import { BuyerTokenPageCreationData } from "@/shared/interfaces/api/payMe";
import { CommonPayment } from "@/shared/models";
import { getFirebaseToken } from "@/shared/utils";
import config from "../config";

const axiosClient = axios.create({
  timeout: AXIOS_TIMEOUT,
});

const endpoints = {
  createBuyerTokenPage: `${config.cloudFunctionUrl}/payments/payme/payin/create-buyer-token-page`,
};

const createBuyerTokenPage = async (
  creationData: BuyerTokenPageCreationData,
): Promise<CommonPayment> => {
  const headers = {
    Authorization: await getFirebaseToken(),
  };
  const { data } = await axiosClient.post<CommonPayment>(
    endpoints.createBuyerTokenPage,
    creationData,
    { headers },
  );

  return data;
};

export default {
  createBuyerTokenPage,
};
