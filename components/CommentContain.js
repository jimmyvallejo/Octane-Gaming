import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { InputAdornment, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Reply from "./ReplyContain";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";

const Comment = ({ comments, authUser, index, setScroll, scroll }) => {
  const anchor = "bottom";
  const [current, setCurrent] = useState(null);
  const [getReplies, setGetReplies] = useState([]);
  const [reply, setReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [using, setUsing] = useState(null);
  const [date, setDate] = useState("");

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  useEffect(() => {
    setCurrent(index);
  }, [reply]);

  useEffect(() => {
    setGetReplies([]);
    const handleGetReplies = async () => {
      try {
        let replies = await axios.post(`${baseUrl}api/getReplies`, {
          commentId: comments._id,
        });
        setGetReplies(replies.data.replies);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetReplies();
  }, []);

  const toggleDrawer = (anchor, open) => (event) => {
    if (!using) {
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

  const handleReply = async () => {
    try {
      const data = {
        owner: authUser.id,
        ownerName: authUser.username,
        ownerPic: authUser.image,
        post: replyText,
        commentId: comments._id,
      };
      const reply = await axios.post(`${baseUrl}api/commentReply`, data);
      setGetReplies(reply.data.updatedComment.replies);
      handleCurrent(index);
      setUsing(false);
      toggleDrawer(anchor, false);
      setReplyText("");
    } catch (error) {
      setUsing(null);
      console.log(error);
    }
  };

  const handleCurrent = () => {
    setReply(!reply);
    setScroll(!scroll);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      className="flex justify-center flex-col items-center drawer pt-5 pb-5"
    >
      <h1 className="text-gray-300 pb-3 text-xl">Add Reply</h1>
      <div className="flex w-full items-center justify-center">
        <TextField
          onChange={(e) => setReplyText(e.target.value)}
          onFocus={() => setUsing(true)}
          value={replyText}
          InputProps={{
            endAdornment: (
              <InputAdornment
                onClick={handleReply}
                position="end"
                sx={{ marginRight: 1, cursor: "pointer", color: "white" }}
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
          className="w-[50%] bg-gray-800 text-whitetext-xl rounded-lg text-white mb-5 ml-5 rounded-md"
        />
        <Image
          src={"https://www.svgrepo.com/show/286913/close-error.svg"}
          width={25}
          height={25}
          className="mb-5 ml-5 cursor-pointer"
          alt="close"
          onClick={handleClose}
        ></Image>
      </div>
    </Box>
  );

  useEffect(() => {
    const currentDate = new Date();
    const timeStamp = new Date(comments.createdAt);
    const oneDay = 24 * 60 * 60 * 1000;
    const differenceInDays = Math.floor(
      (currentDate - timeStamp) / oneDay
    ).toString();
    setDate(differenceInDays);
  }, []);

  return (
    <div className="flex items-start justify-start flex flex-col ml-5 mt-5 mb-5 ">
      <div className="flex">
        <Image
          src={comments.ownerPic}
          width={30}
          height={30}
          className="mr-3"
          alt="Comment Owner Picture"
        />
        <h1 className="text-white">{comments.ownerName}: </h1>
      </div>
      <p className="min-w-[87%] max-w-[87%] rounded-md ml-11">
        {comments.post}
      </p>
      <div className="flex items-center mt-2.5 ml-1">
        <p className="text-xs text-slate-300 opacity-90">{date !== "0" ? `${date}d ago` : `Today`}</p>
        <button className="text-xs ml-3" onClick={() => handleCurrent(index)}>
          {getReplies.length} {getReplies.length === 1 ? "reply" : "replies"}
        </button>
        {authUser && (
          <button onClick={toggleDrawer(anchor, true)} className="text-xs ml-3">
            Reply
          </button>
        )}
      </div>
      {reply && current === index && (
        <div
          className={`flex justify-start items-center min-w-[95%] max-w-[95%] mt-10 flex-col   rounded-lg pt-2 fade-in-top reply`}
        >
          <div
            className={`overflow-y-scroll w-[90%] max-h-[50%]  rounded-md flex flex-col commentContain reply `}
          >
            {getReplies.map((reply, index) => {
              return <Reply key={index} reply={reply} />;
            })}
          </div>
          <div className="flex justify-between w-[95%] mt-5 mb-3">
            <button className="ml-3 mt-3" onClick={() => setReply(!reply)}>
              Close
            </button>
            {authUser ? (
              <Button
                className="text-md text-white mt-3 pt-1 mb-2 border w-[10%]"
                style={{ backgroundColor: "#630330", color: "white" }}
                onClick={toggleDrawer(anchor, true)}
              >
                Reply
              </Button>
            ) : (
              <Link
                className="text-md text-white  pt-3  ml-10 "
                href={"/login"}
              >
                Sign in to Reply
              </Link>
            )}
          </div>
        </div>
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
    </div>
  );
};

export default Comment;
