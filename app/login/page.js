"use client";
import React, { useEffect } from "react";
import { TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "@components/authProvider";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import Image from "next/image";

const Login = () => {
  const { authenticateUser, setAuthUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)

  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
      console.log(res)
    })();
  }, []);

  const handleSubmit = async () => {
    const data = { email: email, password: password };
    try {
      const login = await axios.post(`${baseUrl}api/loginUser`, data);
      console.log("Message:", login.data);
      localStorage.setItem("authToken", login.data.token);
      authenticateUser();
      router.push('/')

    } catch (error) {
      setError(error.response.data)
    }
  };

  useEffect(() => {
    if(session) { 
      setAuthUser(session.user)
      router.push("/")
    }
  },[session])

  return (
    <div className="text-white flex items-center flex-col text-2xl text-red-500 pt-20 ml-[14%]">
      <h1 className="mb-5">Login</h1>
      <div>
        <TextField
          variant="outlined"
          label="Email"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#DC143C",
              },
              "&:hover fieldset": {
                borderColor: "#DC143C",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#DC143C",
              },
            },
            "& .MuiInputBase-input": {
              color: "#DC143C",
            },
            "& .MuiFormLabel-root": {
              color: "#DC143C",
            },
            marginRight: "5px",
          }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="Password"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#DC143C",
              },
              "&:hover fieldset": {
                borderColor: "#DC143C",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#DC143C",
              },
            },
            "& .MuiInputBase-input": {
              color: "#DC143C",
            },
            "& .MuiFormLabel-root": {
              color: "#DC143C",
            },
            marginLeft: "5px",
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        sx={{
          marginLeft: "5px",
          marginTop: "20px",
          borderColor: "#DC143C",
          color: "#DC143C",
          "&:hover": {
            borderColor: "#B22222",
          },
        }}
        variant="outlined"
        endIcon={<SendIcon />}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.id} className="flex items-center w-[15%]  justify-around mt-10 ">
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  
                >
                  Sign in with: 
                </button>
                <Image src={`/assets/icons/google.png`} width={35} height={50} alt="google" />
                </div>
              ))}
          
    </div>
  );
};

export default Login;
