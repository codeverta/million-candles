import axios from "axios";
import { toast } from "sonner";

const setDefaultHeaders = (config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  config.headers = {
    ...config.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
  };

  return config;
};

const handleRequestError = (error) => Promise.reject(error);

const handleResponseError = (error) => {
  if (typeof window !== "undefined" && error.response?.status === 401) {
    window.location.href = "/";
  }

  try {
    const errors = error.response?.data?.errors ?? [];
    errors.forEach((err) => toast.error(err.detail));
  } catch (_) {}

  return Promise.reject(error);
};

const api = {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;

    axios.interceptors.request.use(setDefaultHeaders, handleRequestError);
    axios.interceptors.response.use(undefined, handleResponseError);
  },
};

export default api;
