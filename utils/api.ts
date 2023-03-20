import axios, { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

const api = {
  init(baseURL: string) {
    axios.defaults.baseURL = baseURL;

    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "application/vnd.api+json";
        config.headers["Accept"] = "application/vnd.api+json";
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    axios.interceptors.response.use(null, (error) => {
      if (error.response.status === 401) {
        window.location.href = "/";
      }
      toast.error(error.response);
      return Promise.reject(error);
    });
  },

  get(url: string, params?: any, config?: any) {
    return axios.get(url, { params, responseType: config?.responseType });
  },

  post(url: string, data: any, config?: AxiosRequestConfig<any>) {
    return axios.post(url, data, config);
  },

  put(url: string, data: any) {
    return axios.put(url, data);
  },

  // patch
  patch(url: string, data: any) {
    return axios.patch(url, data);
  },

  // delete
  delete(url: string) {
    return axios.delete(url);
  },
};

export default api;
