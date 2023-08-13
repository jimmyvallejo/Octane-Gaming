"use client";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { InputAdornment, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "next/image";
import Comment from "./CommentContain";
import { useEffect, useState, useRef, useContext } from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import theme from "./materialUi/materialUi";
import { ClipContext } from "./clipProvider";

export default function SwipeableTemporaryDrawer({
  handleSubmitComment,
  setCommentText,
  commentText,
  using,
  setUsing,
  clip,
  authUser,
}) {
  const [updatedClip, setUpdatedClip] = useState(null);
  const [scroll, setScroll] = useState(null);
  const [comments, setComments] = useState([])
  const {clips} = useContext(ClipContext)

  const divRef = useRef();

  const handleScroll = () => {
    divRef.current.scrollBy(0, 80);
  };

  useEffect(() => {
    handleScroll();
  }, [scroll]);

  const themed = useTheme(theme);

  useEffect(() => {
    console.log("Checking for comments", clip);
    const sorted = clip.comments.sort((a, b) => {
      if (b.createdAt < a.createdAt) {
        return -1; 
      } else if (a.createdAt > b.createdAt) {
        return 1; 
      } else {
        return 0; 
      }
    });
    console.log("Sorted", sorted);
    setComments(sorted);
  }, [clip]);

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });


  useEffect(() => {
    setUpdatedClip(clip);
  }, [using]);

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
    <div className={`flex w-[20%] flex-col h-screen rounded-lg fade-in-top `}>
      {updatedClip !== null ? (
        <div
          className={`overflow-y-scroll w-full h-[88.2%] rounded-md flex flex-col commentContain`}
          ref={divRef}
        >
          {comments.map((comments, index) => {
            return (
              <Comment
                key={comments._id}
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
      ) : (
        <div ref={divRef}></div>
      )}
      <>
        {authUser ? (
          <Button
            className="text-lg text-white border  w-full place-self-center flex  mb-1 "
            style={{ backgroundColor: "#24272c", color: "white" }}
            onClick={toggleDrawer(anchor, true)}
          >
            Add a comment
          </Button>
        ) : (
          <Link
            className="text-lg text-white flex justify-center border border-gray-500 rounded-md"
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
          }}
          onOpen={toggleDrawer(anchor, true)}
        >
          {list(anchor)}
        </SwipeableDrawer>
      </>
    </div>
  );
}
