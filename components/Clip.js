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

export const Clip = ({ clip, index, lastClip, refreshCount, handleTop }) => {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [clipCurrent, setClipCurrent] = useState(clip);
  const { loading } = useContext(ClipContext);
  const [views, setViews] = useState(clipCurrent.views);
  const [likes, setLikes] = useState(clipCurrent.likes.length);
  const [commentlength, setCommentLength] = useState(
    clipCurrent.comments.length
  );
  const [comment, setComment] = useState(true)
  const [playing, setPlaying] = useState(true);
  const [heart, setHeart] = useState(null);
  
  const playerRef = useRef(null);
  const [commentText, setCommentText] = useState("");
  const [using, setUsing] = useState(null);
  const [followed, setFollowed] = useState(false);

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
    if (authUser) {
      if (authUser.following.includes(clipCurrent.ownerId._id)) {
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
  }, [authUser]);

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
      setComment(false)
      setComment(true)
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
      
      {comment && <SwipeableTemporaryDrawer
           
              handleSubmitComment={handleSubmitComment}
              commentText={commentText}
              setCommentText={setCommentText}
              using={using}
              setUsing={setUsing}
              clip={clipCurrent}
              authUser={authUser}
            />
      }
      
            <div></div>
       
        </div>
      ) : (
        <div className="loader"></div>
      )}

      <div className=" w-[78%] h-full  mb-4 ml-4 pt-5 vidInfo rounded-lg ">
        <div className="flex flex-row justify-between w-full h-full">
          <div className="flex flex-row ml-5 justify-start w-full h-[100%]">
            <div className="flex flex-row items-start">
              <Image
                src={
                  clip.image
                    ? clip.image
                    : `https://www.svgrepo.com/show/259535/game-controller.svg`
                }
                width={70}
                height={70}
                alt="user picture"
                className="mr-5 "
              />
              <div>
                <h1 className="text-2xl">{clip.ownerName}</h1>
                <p className="mt-2 text-xl">{clip.description}</p>
              </div>
            </div>
            {authUser && authUser.id !== clipCurrent.ownerId._id && (
              <Button
                className=" ml-5 h-10 mt-2 followbutton"
                variant={!followed ? "outlined" : "outlined"}
                sx={{
                  borderColor: !followed ? "#6c0736" : "default",
                  ":hover": {
                    borderColor: !followed ? "default" : "#6c0736",
                  },
                  color: !followed ? "white" : "white",
                }}
                onClick={handleFollow}
              >
                {!followed ? "Follow" : "Unfollow"}
              </Button>
            )}
          </div>
          <div className="  flex flex-row justify-around w-[30%] items-start ">
            <div className={`mr-2 flex flex-row items-center justify-center`}>
              <Image
                src="/assets/images/play-button.png"
                width={40}
                height={40}
                alt="views"
              />

              <h3 className="text-l ml-1 mt-1">{views}</h3>
            </div>

            {authUser && (
              <div className="flex flex-row items-center z-10">
                <Image
                  src={
                    !heart
                      ? `/assets/icons/heart.png`
                      : `https://www.svgrepo.com/show/397697/red-heart.svg`
                  }
                  width={40}
                  height={40}
                  alt="likes"
                  className="mr-2 cursor-pointer"
                  onClick={handleLike}
                />
                <h3 className="text-l">{likes}</h3>
              </div>
            )}
            {!authUser && (
              <div className="flex items-center flex-row">
                <Image
                  src={`/assets/icons/heart.png`}
                  width={43}
                  height={43}
                  alt="likes"
                  className=""
                />
                <h3 className="text-l">{likes}</h3>
              </div>
            )}

            <div className="flex flex-row items-center ">
              <Image
                src={ `/assets/icons/chat.png`
                   
                }
                width={`45`}
                height={`45`}
                alt="comments"
                className="mr-2 ml-1"
               
              />
              <h3 className="text-l">{commentlength}</h3>
            </div>
          </div>
        </div>
      </div>

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
