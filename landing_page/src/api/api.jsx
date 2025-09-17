import axios from "axios";
import { AuthenticationAPI, UsersAPI } from "../constant/endpoints";
import { getStoredToken, refreshAccessToken } from "../helper/tokenHandler";
const backendUrl = import.meta.env.VITE_PUBLIC_API;
const baseURL = "http://192.168.0.101:3000/api/v1";
const finalUrl = import.meta.env.MODE === 'development' ? baseURL : backendUrl;


const api = async (endpoint, method, body, params) => {
  const tokenData = getStoredToken();
  const isFormData = body instanceof FormData;

  // console.log(tokenData.token)

//   await refreshAccessToken(finalUrl)

  const url = endpoint.replace(/:\w+/g, (match) => {
    const key = match.slice(1);
    return params[key] || match;
  });

  const headers = {
    ...(tokenData?.token ? { Authorization: `Bearer ${tokenData.token}` } : {}),
    ...(isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" }),
  };

  try {
    const response = await axios({
      method: method,
      url: `${finalUrl}${url}`,
      headers: headers,
      data: body,
      params: params,
      withCredentials: true, 
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error.response?.data;
  }
};

export const API = {
  // AUTHENTICATION API //
  loginUserAccount: (body) => api(AuthenticationAPI.loginAccount, "post", body),
  continueAsGuest: (body) =>
    api(AuthenticationAPI.continueAsGuest, "post", body),
  createUserAccount: (body) =>
    api(AuthenticationAPI.createAccount, "post", body),
  verifyAccount: (body) => api(AuthenticationAPI.verifyAccount, "post", body),
  resendVerificationCode: (body) =>
    api(AuthenticationAPI.resendVerification, "patch", body),

  // USER API
   currentUserInfo: () =>
    api(UsersAPI.currentUserDetails, "get", undefined),
};
