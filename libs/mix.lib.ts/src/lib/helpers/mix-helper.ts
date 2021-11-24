import { AxiosRequestConfig } from 'axios';

/**
 * Get Default Configuration
 * @returns { AxiosRequestConfig}
 */
export function getDefaultAxiosConfiguration(): AxiosRequestConfig {
  return {
    withCredentials: false,
    timeout: 30000,
    baseURL: '',
    headers: {
      common: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
    // `paramsSerializer` is an optional function in charge of serializing `params`
    // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
    paramsSerializer: function (params) {
      return Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join('&');
    },
  };
}
