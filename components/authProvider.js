"use client";
import { useEffect, createContext, useState } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";
import { useRouter } from "next/navigation";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const router = useRouter();

  const authenticateUser = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      localStorage.clear();
      setAuthUser(null);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}api/verify`,{Token:token} );
    
      setAuthUser(response.data);
    } catch (err) {
      console.log(err);
      localStorage.clear();
    }
  };

  const changeLogout = () => {
    localStorage.clear();
    setAuthUser(null);
    router.push('/')
  };

  useEffect(() => {
    authenticateUser();
  }, []);

   useEffect(() => {
     console.log("This is authuser:", authUser)
   }, [authUser]);

  return (
    <AuthContext.Provider value={{ authenticateUser, changeLogout, authUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
