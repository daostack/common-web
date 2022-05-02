import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { AXIOS_TIMEOUT } from "../shared/constants";

class GeneralApi {
  private createApiEngine = () => {
    const apiEngine = axios.create({
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
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.get<T>(url, config);
  };

  public post = async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.post<T>(url, data, config);
  };

  public put = async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.put<T>(url, data, config);
  };

  public patch = async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.patch<T>(url, data, config);
  };

  public delete = async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.apiEngine.delete<T>(url, config);
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
export default new GeneralApi();
