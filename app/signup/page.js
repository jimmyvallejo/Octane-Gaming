"use client";
import React from "react";
import { TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect, useContext } from "react";
import { baseUrl } from "@utils/baseUrl";
import axios from "axios";
import { AuthContext } from "@components/authProvider";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

const Signup = () => {
  const { authenticateUser, providers } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
      setAuthUser(session.user);
    }
  }, [session]);

  const handleSubmit = async () => {
    const data = { email: email, username: username, password: password };
    console.log(data);
    try {
      const signUp = await axios.post(`${baseUrl}api/createUser`, data);
      console.log("User created sucesfully:", signUp.data);
      localStorage.setItem("authToken", signUp.data.token);
      authenticateUser();
      if (signUp.status === 201) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  return (
    <div className="text-white justify-center flex items-center flex-col text-2xl text-red-500 pt-20 ml-[14%] h-screen ">
      <div className="w-[30%] flex flex-col justify-center items-center  py-10 rounded-lg loginContain">
      <h1 className="mb-5 text-3xl">Signup to Octane</h1>
      <div className="flex flex-col justify-center items-center w-[70%]">
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
          className="w-full logButton rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="filled"
          label="Username"
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
            marginTop: 1.5,
          }}
          className="w-full logButton rounded"
          onChange={(e) => setUsername(e.target.value)}
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
            marginTop: 1.5,
          }}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full logButton rounded"
        />
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
      >
        Submit
      </Button>
      </div>
      
      <div className="mt-5 pt-3 w-full flex flex-col justify-center items-center">
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
                className="mr-2"
              />
              <button
                type="button"
                key={provider.name}
                className="ml-4 font-light text-xl"
                onClick={() => {
                  signIn(provider.id);
                }}
              >
                Sign up with {provider.name.slice(0, 7)}
              </button>
            </div>
          ))}
      </div>
      </div>
    </div>
  );
};

export default Signup;
