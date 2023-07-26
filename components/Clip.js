"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";
import { AuthContext } from "./authProvider";
import { ClipContext } from "./clipProvider";
import { useContext } from "react";
import SwipeableTemporaryDrawer from "./swipeabledrawer";
import { Button } from "@mui/material";

export const Clip = ({
  clip,
  index,
  lastClip,
  refreshCount,
  refresh,
  handleTop,
}) => {
  const { authUser } = useContext(AuthContext);
  const [clipCurrent, setClipCurrent] = useState(clip);
  const { loading } = useContext(ClipContext);
  const [views, setViews] = useState(clipCurrent.views);
  const [likes, setLikes] = useState(clipCurrent.likes.length);
  const [commentlength, setCommentLength] = useState(
    clipCurrent.comments.length
  );
  const [playing, setPlaying] = useState(null);
  const [heart, setHeart] = useState(null);
  const [comment, setComment] = useState(null);
  const playerRef = useRef(null);
  const [commentText, setCommentText] = useState("");
  const [using, setUsing] = useState(null);
  const [followed, setFollowed] = useState(false);

  const handleView = async () => {
    console.log(clip);
    try {
      let updatedView = await axios.post(`${baseUrl}api/addView`, {
        clipId: clip._id,
      });
      setViews(updatedView.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const idData = {
        clipId: clip._id,
        userId: authUser.id,
      };

      let updatedLike = await axios.post(`${baseUrl}api/addLike`, idData);
      console.log(updatedLike);
      if (updatedLike.data.removed === false) {
        setLikes((prevLikes) => prevLikes + 1);
        setHeart(true);
      } else {
        setLikes((prevLikes) => prevLikes - 1);
        setHeart(null);
      }

      setHeart(!heart);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = () => {
    comment === null ? setComment(true) : setComment(null);
  };

  const handleSubmitComment = async () => {
    const comment = {
      post: commentText,
      owner: authUser.id,
      clipId: clip._id,
      ownerName: authUser.username,
      ownerPic: authUser.image,
    };

    try {
      const createdComment = await axios.post(
        `${baseUrl}api/addComment`,
        comment
      );

      console.log("Created comment:", createdComment);
      setClipCurrent(createdComment.data.updatedvid);
      setCommentText("");
      setComment(null);
      setUsing(null);

      setCommentLength((prevCount) => prevCount + 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
        } else {
          setPlaying(false);
          setUsing(null);
          setComment(null);
        }
      },
      { threshold: 0.5 }
    );

    if (playerRef.current) {
      observer.observe(playerRef.current.wrapper);
    }

    return () => {
      if (playerRef.current) {
        observer.unobserve(playerRef.current.wrapper);
      }
    };
  }, [playing]);

  const handleNewVids = () => {
    handleTop();
    setComment(null);
    setTimeout(() => {
      refreshCount((count) => count + 1);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen justify-center snap-y snap-mandatory snap-center relative items-center ">
      <div className=" flex flex-col items-center ">
        {!loading ? (
          <div className="pt-5">
            <ReactPlayer
              url={clip.url}
              width={`780px`}
              height={`500px`}
              controls={true}
              onPlay={handleView}
              ref={playerRef}
              playing={playing}
            />
          </div>
        ) : (
          <div className="loader"></div>
        )}
        <div
          className={`flex mt-4 flex-row justify-between w-[90%] ${
            comment && ""
          }  `}
        >
          <div className={`mr-2 flex flex-row items-center`}>
            <Image
              src="/assets/images/play-button.png"
              width={25}
              height={25}
              alt="views"
              className={`mr-3 `}
            />
            <h3 className="text-xl">{views}</h3>
          </div>
          <div className="flex flex-row items-center">
            {authUser && (
              <Image
                src={
                  !heart
                    ? `https://www.svgrepo.com/show/513311/heart.svg`
                    : `https://www.svgrepo.com/show/397697/red-heart.svg`
                }
                width={25}
                height={25}
                alt="likes"
                className="mr-2 cursor-pointer"
                onClick={handleLike}
              />
            )}
            {!authUser && (
              <Image
                src={`https://www.svgrepo.com/show/513311/heart.svg`}
                width={25}
                height={25}
                alt="likes"
                className="mr-2"
              />
            )}
            <h3 className="text-xl">{likes}</h3>
            <div className="flex flex-row items-center ml-5">
              <Image
                src={
                  !comment
                    ? `https://www.svgrepo.com/show/485336/comment-balloon-part-3.svg`
                    : `https://www.svgrepo.com/show/273966/close.svg`
                }
                width={!comment ? 25 : 28}
                height={!comment ? 25 : 28}
                alt="comments"
                className="mr-2 cursor-pointer"
                onClick={handleComment}
              />
              <h3 className="text-xl">{commentlength}</h3>
            </div>
          </div>
        </div>

        {!comment ? (
          <div className="flex flex-row vidDet justify-between ">
            <div className="flex vidInfo">
              <Image
                src={
                  clip.image
                    ? clip.image
                    : `https://www.svgrepo.com/show/259535/game-controller.svg`
                }
                width={50}
                height={50}
                alt="user picture"
                className="mr-5 "
              />
              <div className="min-w-[87%] max-w-[87%]">
                <h1>{clip.ownerName}</h1>
                <p className="mt-2">{clip.description}</p>
              </div>
            </div>
            {authUser && <Button
              className="mr-5 h-10 mt-2 followbutton"
              variant={!followed ? "outlined" : "outlined"}
              sx={{
                borderColor: !followed ? "#6c0736" : "default",
                ":hover": {
                  borderColor: !followed ? "default" : "#6c0736",
                },
                color: !followed ? "white" : "white",
                
              }}
              onClick={() => setFollowed(!followed)}
            >
              {!followed ? "Follow" : "Unfollow"}
            </Button>
              }
          </div>
        ) : (
          <div className="border-b w-[90%] mt-10 pt-5 mb-3"></div>
        )}
      </div>

      {comment !== null ? (
        <SwipeableTemporaryDrawer
          handleComment={handleComment}
          comment={comment}
          handleSubmitComment={handleSubmitComment}
          commentText={commentText}
          setCommentText={setCommentText}
          using={using}
          setUsing={setUsing}
          clip={clipCurrent}
          authUser={authUser}
        />
      ) : (
        <div></div>
      )}
      {index === lastClip ? (
        <div className="flex ">
          <Image
            src={"https://www.svgrepo.com/show/274026/refresh.svg"}
            width={40}
            height={40}
            className="mt-20 cursor-pointer spinner"
            onClick={() => handleNewVids()}
            alt="refresh"
          ></Image>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
