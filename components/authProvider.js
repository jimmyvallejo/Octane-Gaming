"use client";
import { useEffect, createContext, useState } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";
import { useRouter } from "next/navigation";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authFollowers, setAuthFollowers] = useState(null)
  const [authFollowing, setAuthFollowing] = useState(null)
  
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
    setAuthFollowing(null)
    setAuthFollowing(null)
    router.push('/')
  };

  useEffect(() => {
    authenticateUser();
  }, []);


   useEffect(() => {
    const getFollowersFollowing= async () => {
      try {
      const response = await axios.post(`${baseUrl}api/getFollowersFollowing`, {id: authUser.id})
      console.log(response.data)
      setAuthFollowers(response.data.userData.followers)
      setAuthFollowing(response.data.userData.following)
      } catch(error){
        console.log(error)
      }
    }
   getFollowersFollowing()
   },[authUser])

   useEffect(() => {
     console.log("This is authuser:", authUser)
     console.log("This is Following:", authFollowers)
     console.log("This is followers:", authFollowing)
   }, [authUser]);

  return (
    <AuthContext.Provider value={{ authenticateUser, changeLogout, authUser, setAuthUser, authFollowers, authFollowing }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
