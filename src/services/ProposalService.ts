import axios from "axios";

import getFirebaseToken from "../helpers/getFirebaseToken";
import { ProposalJoinRequestData } from "../shared/interfaces/api/proposal";
import config from "../config";

const axiosClient = axios.create({
  timeout: 1000000,
});

const endpoints = {
  createRequestToJoin: `${config.cloudFunctionUrl}/proposals/create/join`,
};

const createRequestToJoin = async (data: ProposalJoinRequestData): Promise<void> => {
  await axiosClient.post(endpoints.createRequestToJoin, data, {
    headers: {
      Authorization: await getFirebaseToken(),
    },
  });
};

export default {
  createRequestToJoin,
};
