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
    <div className="text-white flex items-center flex-col text-2xl text-red-500 pt-60 ml-[14%] h-screen ">
      <div className="w-[30%] flex flex-col justify-center items-center  py-10 rounded-lg loginContain">
      <h1 className="mb-5 text-3xl">Log In to Octane</h1>
      <div className="flex flex-col justify-center w-[70%]">
        <TextField
          variant="filled"
          label="Email"
          type="email"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "#white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiFormLabel-root": {
              color: "white",
            },
            marginTop: 1,
          }}
          className="logButton rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="filled"
          label="Password"
          type="password"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "#white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiFormLabel-root": {
              color: "white",
            },
            marginTop: 1,
          }}
          className="logButton rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        sx={{
          marginLeft: "5px",
          marginTop: "20px",
          borderColor: "white",
          color: "white",
          "&:hover": {
            borderColor: "main",
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
            className="flex items-center w-[70%] mt-5  py-2 px-2 justify-center rounded-md logButton "
          >
            <Image
              src={`/assets/icons/${provider.id}.png`}
              width={35}
              height={50}
              alt="google"
              className="mr-4"
            />
            <button
              type="button"
              key={provider.name}
              className="ml-4 font-light text-xl"
              onClick={() => {
                signIn(provider.id);
              }}
            >
              Sign in with {provider.name.slice(0, 7)}
            </button>
          </div>
        ))}
        </div>
    </div>
  );
};

export default Login;
