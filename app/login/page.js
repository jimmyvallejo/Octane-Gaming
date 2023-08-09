"use client";
import React, { useEffect } from "react";
import { TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "@components/authProvider";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

const Login = () => {
  const { authenticateUser, setAuthUser, providers } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { data: session } = useSession();

  const router = useRouter();

  const handleSubmit = async () => {
    const data = { email: email, password: password };
    try {
      const login = await axios.post(`${baseUrl}api/loginUser`, data);
      console.log("Message:", login.data);
      localStorage.setItem("authToken", login.data.token);
      authenticateUser();
      router.push("/");
    } catch (error) {
      setError(error.response.data);
    }
  };

  useEffect(() => {
    if (session) {
      router.push("/");
      setAuthUser(session.user);
    }
  }, [session]);

  return (
    <div className="text-white flex items-center flex-col text-2xl text-red-500 pt-20 ml-[14%]">
      <h1 className="mb-5">Login</h1>
      <div className="flex flex-col justify-center w-[18%]">
        <TextField
          variant="outlined"
          label="Email"
          type="email"
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
          }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="Password"
          type="password"
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
            marginTop: 1,
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
        className="mb-5"
      >
        Submit
      </Button>
      {providers &&
        Object.values(providers).map((provider) => (
          <div
            key={provider.id}
            className="flex items-center w-[20%] mt-5 border py-2 px-2 justify-center rounded-md "
          >
            <Image
              src={`/assets/icons/${provider.id}.png`}
              width={35}
              height={50}
              alt="google"
              className="mr-2"
            />
            <button
              type="button"
              key={provider.name}
              className="ml-2 font-light"
              onClick={() => {
                signIn(provider.id);
              }}
            >
              Sign in with {provider.name.slice(0, 7)}
            </button>
          </div>
        ))}
    </div>
  );
};

export default Login;
