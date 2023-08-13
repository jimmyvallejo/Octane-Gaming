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
import ClipInfo from "./ClipInfo";

export const Clip = ({ clip, index, lastClip, refreshCount, handleTop }) => {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [clipCurrent, setClipCurrent] = useState(clip);
  const { loading } = useContext(ClipContext);
  const [views, setViews] = useState(null);
  const [likes, setLikes] = useState(null);
  const [commentlength, setCommentLength] = useState(null);
  const [comment, setComment] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [heart, setHeart] = useState(null);

  const playerRef = useRef(null);
  const [commentText, setCommentText] = useState("");
  const [using, setUsing] = useState(null);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
   setClipCurrent(clip)
   setViews(clip.views)
   setLikes(clipCurrent.likes.length)
   setCommentLength(clipCurrent.comments.length)
  },[authUser, clip])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
        } else {
          setPlaying(false);
          setUsing(null);
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

  useEffect(() => {
    console.log("This is authuser:", authUser);
    console.log("ClipCurrent" ,clipCurrent)
    if (authUser) {
      if (authUser.following.includes(clipCurrent.ownerId._id) || authUser.following.includes(clip.ownerId)) {
        setFollowed(true);
      } else {
        setFollowed(false);
      }
      if (clipCurrent.likes.includes(authUser.id)) {
        setHeart(true);
      } else {
        setHeart(null);
      }
    }
  }, [authUser, clipCurrent]);





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
    } catch (error) {
      console.log(error);
    }
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
      setComment(false);
      setComment(true);
      setCommentText("");
      setUsing(null);

      setCommentLength((prevCount) => prevCount + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewVids = () => {
    handleTop();
    setTimeout(() => {
      refreshCount((count) => count + 1);
    }, 1000);
  };

  const handleFollow = async () => {
    try {
      const credentials = {
        clipOwner: clipCurrent.ownerId._id,
        currentUser: authUser.id,
      };

      const follow = await axios.post(
        `${baseUrl}api/handleFollow`,
        credentials
      );

      console.log("This is follow.data:", follow.data);

      if (follow.data.removed === true) {
        setFollowed(false);
        const updatedAuthUser = { ...authUser };
        const indexToRemove = updatedAuthUser.following.indexOf(
          clipCurrent.ownerId._id
        );
        if (indexToRemove !== -1) {
          updatedAuthUser.following.splice(indexToRemove, 1);
        }
        setAuthUser(updatedAuthUser);
      } else {
        setFollowed(true);
        const updatedAuthUser = { ...authUser };
        updatedAuthUser.following.push(clipCurrent.ownerId._id);
        setAuthUser(updatedAuthUser);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-screen snap-y snap-mandatory snap-center relative  ml-[14%] clip  ">
      {!loading ? (
        <div className=" w-[100%] h-[80%] flex flex-row pb-12 ">
          <ReactPlayer
            url={clip.url}
            width={`80%`}
            height={`100%`}
            controls={true}
            onPlay={handleView}
            ref={playerRef}
            playing={playing}
          />

          {comment && (
            <SwipeableTemporaryDrawer
              handleSubmitComment={handleSubmitComment}
              commentText={commentText}
              setCommentText={setCommentText}
              using={using}
              setUsing={setUsing}
              clip={clipCurrent}
              authUser={authUser}
            />
          )}
        </div>
      ) : (
        <div className="text-3xl flex items-center justify-center w-[100%] h-screen ml-[14%] clip border">Loading...</div>
      )}
      <ClipInfo
        clip={clip}
        views={views}
        commentlength={commentlength}
        handleLike={handleLike}
        handleFollow={handleFollow}
        authUser={authUser}
        clipCurrent={clipCurrent}
        followed={followed}
        heart={heart}
        likes={likes}
      />
      {index === lastClip ? (
        <Image
          src={"https://www.svgrepo.com/show/274026/refresh.svg"}
          width={40}
          height={40}
          className=" cursor-pointer spinner place-self-center mr-80  mb-6 "
          onClick={() => handleNewVids()}
          alt="refresh"
        ></Image>
      ) : (
        <div></div>
      )}
    </div>
  );
};
