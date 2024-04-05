import { ToastFailure } from "../Toast/ToastMsg";

function clearAuthenticationToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("isLogin");
  localStorage.removeItem("userName");
}

export const handleAxiosResponse = (response) => {
  if (response?.data?.status === 208) {
    ToastFailure(response?.data?.message);
  }
  return Promise.resolve(response);
};
export const handleAxiosError = (error, navigateToLoginPage, setIsUser) => {
  const errorMessage =
    error?.response?.data?.message || error?.response?.data?.error;
  if (error.request.status === 404) {
    ToastFailure(error?.response?.data?.error);
  }
  if (error?.response?.status === 401) {
    clearAuthenticationToken();
    navigateToLoginPage("/");
    setIsUser(false);
    ToastFailure(errorMessage);
    return false;
  }
  if (error.request.status >= 400 && error.request.status <= 499) {
    ToastFailure(errorMessage);
  } else if (error.request.status > 499) ToastFailure("Internal Server Error");

  return Promise.reject(error);
};
