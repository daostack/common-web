import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import tokenHandler from "./tokenHandler";

axios.defaults.headers.post["Content-Type"] = "application/json";

const axiosInstance: AxiosInstance = axios.create();

const makeRequest = (instance: AxiosInstance) => (method: string, url: string, params: unknown) => {
  const token = tokenHandler.get();

  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return instance[method](url, ...params);
};

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const response = res.data || res;

    if (response.error) {
      return Promise.reject(response.error);
    }

    return response;
  },
  (error: AxiosError) => {
    const { response } = error || {};
    const { data } = response || {};
    if (data) {
      return Promise.reject(data);
    }
    return Promise.reject(error);
  },
);
/**
 * Axios wrapper
 *
 * @param  {string} method Method of the request
 * @param  {string} url url of the request
 *
 * @return {object} wrapped axios function that receives params
 */
export default (method: string, url: string) => (...params: unknown[]) =>
  makeRequest(axiosInstance)(method, url, params);
