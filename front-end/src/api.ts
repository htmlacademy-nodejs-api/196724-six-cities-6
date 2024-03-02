import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { Token } from './utils';
import {ApplicationError, ApplicationErrorType} from './types/types';

const BACKEND_URL = 'http://localhost:4000';
const REQUEST_TIMEOUT = 5000;

const isValidationError = (data: unknown): data is ApplicationError =>
  (data as ApplicationError)?.errorType === ApplicationErrorType.ValidationError || !!(data as ApplicationError)?.details;
export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = Token.get();

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      toast.dismiss();

      if (isValidationError(error.response?.data)) {
        error.response?.data?.details.forEach((i) => {
          toast.warn(i.message);
        });

      } else {
        toast.warn(error.response ? error.response.data.error : error.message);
      }


      return Promise.reject(error);
    }
  );

  return api;
};
