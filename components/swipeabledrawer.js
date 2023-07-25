'use client'

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { InputAdornment, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "next/image";
 import Comment from "./CommentContain";
 import { useEffect, useState } from "react";

export default function SwipeableTemporaryDrawer({
  handleComment,
  handleSubmitComment,
  setCommentText,
  commentText,
  using,
  setUsing,
  clip,
}) {


const [updatedClip, setUpdatedClip] = useState(null);

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
      className="flex justify-center flex-col items-center bg-black"
    >
      <h1>Add comment</h1>
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
          className="w-[50%] bg-gray-800 text-whitetext-xl rounded-lg text-white mb-5 ml-5"
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
    <div className="flex justify-start mb-5  min-w-[40%] max-w-[40%] mt-10 flex-col min-h-[70%] rounded-lg pt-2 ">
      {updatedClip !== null && (
        <div className="overflow-y-scroll w-full  h-[50%] rounded-md flex flex-col commentContain ">
          {updatedClip.comments.map((comment, index) => {
            return <Comment key={comment._id} comment={comment} />;
          })}
        </div>
      )}
      <>
        <Button
          className="text-lg text-white mt-3 pt-3"
          onClick={toggleDrawer(anchor, true)}
        >
          Add a comment
        </Button>
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
