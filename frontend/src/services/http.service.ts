import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

import { APIResponse } from "../types/APIResponse";

class HttpService {
  constructor(api: AxiosInstance) {
    this.#api = api;
  }

  #api: AxiosInstance;

  async get<T>(path: string, options?: AxiosRequestConfig) {
    try {
      return await this.#api.get<APIResponse<T>>(path, options);
    } catch (error) {
      return {
        data: (error as AxiosError).response?.data,
        status: (error as AxiosError).response?.status,
      } as AxiosResponse<APIResponse<T>>;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T>(
    path: string,
    body?: any,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<APIResponse<T>>> {
    try {
      return await this.#api.post<APIResponse<T>>(path, body, options);
    } catch (error) {
      return {
        data: (error as AxiosError).response?.data,
        status: (error as AxiosError).response?.status,
      } as AxiosResponse<APIResponse<T>>;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T>(path: string, body?: any, options?: AxiosRequestConfig) {
    try {
      return await this.#api.put<APIResponse<T>>(path, body, options);
    } catch (error) {
      return {
        data: (error as AxiosError).response?.data,
        status: (error as AxiosError).response?.status,
      } as AxiosResponse<APIResponse<T>>;
    }
  }

  async delete<T>(path: string, options?: AxiosRequestConfig) {
    try {
      return await this.#api.delete<APIResponse<T>>(path, options);
    } catch (error) {
      return {
        data: (error as AxiosError).response?.data,
        status: (error as AxiosError).response?.status,
      } as AxiosResponse<APIResponse<T>>;
    }
  }
}

export default HttpService;
