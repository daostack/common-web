import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import config from "@/config";
import getFirebaseToken from "@/helpers/getFirebaseToken";
import { default as store } from "@/index";
import { AXIOS_TIMEOUT } from "@/shared/constants";

interface RequestConfig extends AxiosRequestConfig {
  isAuthorizedRequest?: boolean;
}

const waitForAuthenticationToBeReady = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    let count = 0;

    const checkIsAuthenticationReady = () => {
      count++;

      if (store.getState().auth.isAuthenticationReady) {
        resolve();
        return;
      }
      if (count >= 50) {
        reject(new Error("Authentication readiness check is timed out"));
      }

      setTimeout(checkIsAuthenticationReady, 100);
    };

    checkIsAuthenticationReady();
  });

class Api {
  private createApiEngine = () => {
    const apiEngine = axios.create({
      baseURL: config.cloudFunctionUrl,
      timeout: AXIOS_TIMEOUT,
    });

    return {
      get: apiEngine.get,
      post: apiEngine.post,
      put: apiEngine.put,
      patch: apiEngine.patch,
      delete: apiEngine.delete,
    };
  };

  private apiEngine = this.createApiEngine();

  public get = async <T>(
    url: string,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.get<T>(url, await this.expandConfig(config));
  };

  public post = async <T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.post<T>(url, data, await this.expandConfig(config));
  };

  public put = async <T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.put<T>(url, data, await this.expandConfig(config));
  };

  public patch = async <T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.patch<T>(url, data, await this.expandConfig(config));
  };

  public delete = async <T>(
    url: string,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.delete<T>(url, await this.expandConfig(config));
  };

  private getHeaders = async ({
    isAuthorizedRequest = true,
    headers = {},
  }: RequestConfig = {}) => {
    const newHeaders = { ...headers };

    if (isAuthorizedRequest && !newHeaders.Authorization) {
      await waitForAuthenticationToBeReady();
      newHeaders.Authorization = await getFirebaseToken();
    }

    return { headers: newHeaders };
  };

  private expandConfig = async (
    config: RequestConfig = {}
  ): Promise<RequestConfig> => ({
    ...config,
    ...(await this.getHeaders(config)),
  });
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
