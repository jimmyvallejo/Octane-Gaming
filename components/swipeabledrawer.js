"use client";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { InputAdornment, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "next/image";
import Comment from "./CommentContain";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import theme from "./materialUi/materialUi";

export default function SwipeableTemporaryDrawer({
  handleComment,
  handleSubmitComment,
  setCommentText,
  commentText,
  using,
  setUsing,
  clip,
  authUser,
  comment,
}) {
  const [updatedClip, setUpdatedClip] = useState(null);
  const [scroll, setScroll] = useState(null)


  const divRef = useRef();

  const handleScroll = () => {
    divRef.current.scrollBy(0, 80);
  };

  useEffect(() => {
      handleScroll();
  }, [scroll]);


  const themed = useTheme(theme);

  useEffect(() => {
    console.log(themed);
  }, [themed]);

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  useEffect(() => {
    setUpdatedClip(clip);
  }, []);

  useEffect(() => {
    console.log("updated clip:", updatedClip);
  }, [updatedClip]);

  const anchor = "bottom";

  const toggleDrawer = (anchor, open) => (event) => {
    if (using === null) {
      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    }
  };

  const handleClose = () => {
    setUsing(null);
    toggleDrawer(anchor, false);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      className="flex justify-center flex-col items-center drawer pt-5 pb-5"
    >
      <h1 className="text-gray-300 pb-3 text-xl">Add comment</h1>
      <div className="flex w-full items-center justify-center">
        <TextField
          onChange={(e) => setCommentText(e.target.value)}
          onFocus={() => setUsing(true)}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{ marginRight: 1, cursor: "pointer", color: "white" }}
                onClick={handleSubmitComment}
              >
                <ArrowForwardIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            color: "white",
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "violet",
              },
            },
          }}
          value={commentText}
          className="w-[50%] bg-gray-800 text-whitetext-xl rounded-lg text-white mb-5 ml-5 rounded-md"
        />
        <Image
          src={"https://www.svgrepo.com/show/286913/close-error.svg"}
          width={25}
          height={25}
          className="mb-5 ml-5 cursor-pointer"
          onClick={handleClose}
          alt="close"
        ></Image>
      </div>
    </Box>
  );

  return (
    <div
      className={`flex justify-start mb-5  min-w-[40%] max-w-[40%] mt-10 flex-col min-h-[70%] rounded-lg pt-2 fade-in-top`}
    >
      {updatedClip !== null && (
        <div
          className={`overflow-y-scroll w-full h-[60%] rounded-md flex flex-col commentContain`} 
          ref={divRef}
        >
          {updatedClip.comments.map((comments, index) => {
            return (
              <Comment
                key={comment._id}
                comments={comments}
                authUser={authUser}
                list={list}
                index={index}
                setScroll={setScroll}
                scroll={scroll}
              />
            );
          })}
        </div>
      )}
      <>
        {authUser ? (
          <Button
            className="text-lg text-white mt-3 pt-3 border"
            style={{ backgroundColor: "#630330", color: "white" }}
            onClick={toggleDrawer(anchor, true)}
          >
            Add a comment
          </Button>
        ) : (
          <Link
            className="text-lg text-white mt-3 pt-3 flex justify-center"
            href={"/login"}
          >
            Sign in to comment
          </Link>
        )}
        <SwipeableDrawer
          anchor={anchor}
          open={state[anchor]}
          onClose={() => {
            toggleDrawer(anchor, false);
            handleComment();
          }}
          onOpen={toggleDrawer(anchor, true)}
        >
          {list(anchor)}
        </SwipeableDrawer>
      </>
    </div>
  );
}
