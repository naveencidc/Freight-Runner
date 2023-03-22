import axios, {AxiosRequestConfig} from 'axios';
import Config from 'react-native-config';
import storage from '../helpers/storage';
// import NetInfo from "@react-native-community/netinfo";
import {ApiResponse} from '../types/global';

type Action = 'get' | 'post' | 'put' | 'patch' | 'delete';

type Request = {
  endpoint: string;
  version?: string;
  data?: any;
  urlParams?: any;
};
console.log('-------BaseURL', Config.API_HOST);
const instance = axios.create({
  baseURL: Config.API_HOST,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // transformRequest: [requestTransformer],
  // transformResponse: [responseTransformer]
});

async function request<T>(method: Action, params: Request) {
  const config = await configureRequest({method, params});
  console.log('--config---', config);
  return instance.request<ApiResponse<T>>(config);
}

export default request;

async function fetch<T>(params: Request) {
  return request<T>('get', params);
}

async function post<T>(params: Request) {
  return request<T>('post', params);
}

async function patch<T>(params: Request) {
  return request<T>('patch', params);
}

async function put<T>(params: Request) {
  return request<T>('put', params);
}

async function destroy<T>(params: Request) {
  return request<T>('delete', params);
}

export {fetch, post, patch, put, destroy};

async function session() {
  const userToken = await storage.get('tokens'); // Get previous tokens
  if (userToken && userToken.access.token) {
    return {
      // ["X-User-Token"]: authenticationToken,
      // ["X-User-Email"]: email,
      Authorization: 'Bearer ' + userToken.access.token,
    };
  }
}

async function configureRequest({
  method,
  params,
}: {
  method: Action;
  params: Request;
}): Promise<AxiosRequestConfig> {
  const {version, endpoint, data, urlParams} = params;
  const headers = await session();
  const config: AxiosRequestConfig = {
    url: [version || 'v1', endpoint].join('/'),
    method,
    data,
    headers,
    params: urlParams,
  };
  return config;
}
