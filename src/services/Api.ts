import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import config from "../config";
import getFirebaseToken from "../helpers/getFirebaseToken";

interface RequestConfig extends AxiosRequestConfig {
  isAuthorizedRequest?: boolean;
}

class Api {
  private createApiEngine = () => {
    const apiEngine = axios.create({
      baseURL: config.cloudFunctionUrl,
      timeout: 1000000,
    });

    return {
      get: apiEngine.get,
      post: apiEngine.post,
      delete: apiEngine.delete,
      put: apiEngine.put,
    };
  };

  private apiEngine = this.createApiEngine();

  public get = async <T>(
    url: string,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.get<T>(url, {
      ...config,
      ...(await this.getHeaders(config)),
    });
  };

  public post = async <T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.post<T>(url, data, {
      ...config,
      ...(await this.getHeaders(config)),
    });
  };

  public put = async <T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.put<T>(url, data, {
      ...config,
      ...(await this.getHeaders(config)),
    });
  };

  public delete = async <T>(
    url: string,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.delete<T>(url, {
      ...config,
      ...(await this.getHeaders(config)),
    });
  };

  private getHeaders = async ({
    isAuthorizedRequest = true,
    headers = {},
  }: RequestConfig = {}) => {
    const newHeaders = { ...headers };

    if (isAuthorizedRequest && !newHeaders.Authorization) {
      newHeaders.Authorization = await getFirebaseToken();
    }

    return { headers: newHeaders };
  };
}

export const isRequestError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

export const getCancelTokenSource = (): CancelTokenSource => {
  return axios.CancelToken.source();
};

export const isRequestCancelled = (error: unknown): boolean => {
  return axios.isCancel(error);
};

export type { CancelToken } from "axios";
export default new Api();
