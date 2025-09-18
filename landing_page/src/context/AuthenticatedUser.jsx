import { useState, useContext, createContext, useEffect } from "react";
import { API } from "../api/api";
import { clearToken } from "../helper/tokenHandler";

export const AuthenticatedContext = createContext();

export const AuthenticatedProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const fetchUserDetails = async () => {
        try {
            const response = await API.currentUserInfo();
           setCurrentUser(response.data)
        } catch (error) {
            console.log(error)
            setCurrentUser(null)
        }
    }

   const handleLogout = async () => {
    clearToken();
    location.href = '/'
}

    useEffect(()=>{
        fetchUserDetails();
    },[])

  return (
    <AuthenticatedContext.Provider
      value={{
        currentUser, setCurrentUser,
        handleLogout
      }}
    >
      {children}
    </AuthenticatedContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthenticatedContext);
