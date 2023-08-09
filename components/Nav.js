"use client";
import Link from "next/link";
import React, { use } from "react";
import { AuthContext } from "./authProvider";
import { ClipContext } from "./clipProvider";
import { useContext } from "react";
import Image from "next/image";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


const Nav = () => {
  const { changeLogout, authUser } = useContext(AuthContext);
  const { getRandomClips } = useContext(ClipContext);

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
        <div className="flex  w-[20%]">
          <TextField
            id="search"
            type="search"
            sx={{
              width: "100%",
              height: 40,
              backgroundColor: "#191b1f",
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
                  <SearchIcon sx={{ color: "grey" }} />
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
          <div className="p-3 flex items-center">
            {" "}
            <div className="border py-1 rounded-sm hover:border-violet-500 transition ease-in-out duration-200">
              <Link className="p-3" href="/upload">
                + Upload
              </Link>
            </div>
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
