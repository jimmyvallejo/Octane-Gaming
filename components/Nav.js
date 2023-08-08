"use client";
import Link from "next/link";
import React, { use } from "react";
import { AuthContext } from "./authProvider";
import { ClipContext } from "./clipProvider";
import { useContext } from "react";
import Image from "next/image";
import {  InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


const Nav = () => {
  const { changeLogout, authUser } = useContext(AuthContext);
  const {getRandomClips} = useContext(ClipContext)

  return (
    <div className="flex fixed nav items-center ">
      <div className="flex justify-between items-center  w-screen">
        <Link className="ml-3" href="/">
          <Image
            src="/assets/images/octanelogo.png"
            width={130}
            height={90}
            className=" rounded-md"
            alt="logo"
            onClick={getRandomClips}
           
          />
        </Link>
        <div>
          <TextField
            id="search"
            type="search"
            sx={{
              width: 350,
              height: 40,
              backgroundColor: "#191b1f",
              marginRight: "140px",
           
              

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
                <InputAdornment position="end" sx={{ marginBottom: 2 }}>
                  <SearchIcon sx={{color: "grey"}} />
                </InputAdornment>
              ),
            }}
            className="ml-5 search"
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
