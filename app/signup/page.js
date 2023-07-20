"use client";
import React from "react";
import { TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect, useContext } from "react";
import { baseUrl } from "@utils/baseUrl";
import axios from "axios";
import { AuthContext } from "@components/authProvider";
import { useRouter } from "next/navigation";

const Signup = () => {
  const { authenticateUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async () => {
    const data = { email: email, username: username, password: password };
    console.log(data);
    try {
      const signUp = await axios.post(`${baseUrl}api/createUser`, data);
      console.log("User created sucesfully:", signUp.data);
      localStorage.setItem("authToken", signUp.data.token);
      authenticateUser()
      if (signUp.status === 201) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data)
    }
  };

    useEffect(() => {
      console.log(error);
    }, [error]);

  return (
    <div className="text-white flex items-center flex-col text-2xl text-red-500">
      <h1 className="mb-5">Signup</h1>
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
          label="Username"
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
          onChange={(e) => setUsername(e.target.value)}
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
    </div>
  );
};

export default Signup;
