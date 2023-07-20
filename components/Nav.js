"use client";
import Link from "next/link";
import React, { use } from "react";
import { AuthContext } from "./authProvider";
import { useContext } from "react";
import Image from "next/image";
import { Container, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Nav = () => {
  const { changeLogout, authUser } = useContext(AuthContext);

  return (
    <div className="flex fixed bg-gray-600 nav items-center">
      <div className="flex justify-between  w-screen">
        <Link className="" href="/">
          <Image
            src="/assets/images/Screenshot from 2023-07-18 13-52-00.png"
            width={100}
            height={50}
            className="ml-5 rounded-md"
            alt="logo"
          />
        </Link>
        <div>
          <TextField
            id="search"
            type="search"
            sx={{
              width: 450,
              height: 45,
              backgroundColor: "#a9a9a9",
              borderRadius: "50px",

              ".MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ marginBottom: 1 }}>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        {!authUser ? (
          <div className="p-3">
            <Link className="px-3" href="/signup">
              Signup
            </Link>
            <Link className="px-3" href="/login">
              Login
            </Link>
          </div>
        ) : (
          <div className="p-3">
            {" "}
            <Link className="p-3" href="/upload">
              Upload
            </Link>
            <a className="p-3 cursor-pointer" onClick={changeLogout}>
              Logout
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
