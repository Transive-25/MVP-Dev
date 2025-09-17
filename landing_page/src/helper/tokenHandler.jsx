import axios from "axios";
import Cookies from "js-cookie";

// Save token
export const saveToken = (token) => {
  Cookies.set("Authorization", token, { expires: 1, path: "/" }); 
  // expires: 1 → 1 day
};

// Get token
export const getStoredToken = () => {
  const token = Cookies.get("Authorization");
  return token ? { token } : null;
};

// Clear token
export const clearToken = () => {
  Cookies.remove("Authorization", { path: "/" });
};

export const refreshAccessToken = async (finalUrl) => {
  try {
    const response = await axios.post(
      `${finalUrl}/auth/refresh`,
      {},
      { withCredentials: true } // ensures cookies are sent
    );

    const newAccessToken = response.data.accessToken;
    console.log("NEW ACCESS TOKEN", newAccessToken)
    saveToken(newAccessToken); // save in cookies
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed", error);
    clearToken();
    throw error;
  }
};

