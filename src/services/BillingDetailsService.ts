import axios from "axios";

import getFirebaseToken from "../helpers/getFirebaseToken";
import { BillingDetails } from "../shared/models/BillingDetails";
import config from "../config";

const axiosClient = axios.create({
  timeout: 1000000,
});

const endpoints = {
  getBillingDetails: `${config.cloudFunctionUrl}/payments/billing-details/get`,
  addBillingDetails: `${config.cloudFunctionUrl}/payments/billing-details/add`,
  updateBillingDetails: `${config.cloudFunctionUrl}/payments/billing-details/update`,
};

const getBillingDetails = async (): Promise<BillingDetails | null> => {
  try {
    const { data } = await axiosClient.get<BillingDetails>(endpoints.getBillingDetails, {
      headers: {
        Authorization: await getFirebaseToken(),
      },
    });

    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

const createBillingDetails = async (data: BillingDetails): Promise<void> => {
  await axiosClient.post(endpoints.addBillingDetails, data, {
    headers: {
      Authorization: await getFirebaseToken(),
    },
  });
};

const updateBillingDetails = async (data: Partial<BillingDetails>): Promise<void> => {
  await axiosClient.patch(endpoints.updateBillingDetails, data, {
    headers: {
      Authorization: await getFirebaseToken(),
    },
  });
};

export default {
  getBillingDetails,
  createBillingDetails,
  updateBillingDetails,
};
