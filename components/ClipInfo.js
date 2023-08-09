import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@mui/material";

const ClipInfo = ({
  clip,
  views,
  likes,
  commentlength,
  handleLike,
  handleFollow,
  authUser,
  clipCurrent,
  followed,
  heart,
}) => {

  const [date, setDate] = useState("")

  useEffect(() => {
    const currentDate = new Date();
    const timeStamp = new Date(clip.createdAt);
    const oneDay = 24 * 60 * 60 * 1000; 
     const differenceInDays = Math.floor((currentDate - timeStamp) / oneDay).toString();
     setDate(differenceInDays)
  },[])

  return (
    <div className=" w-[78%] h-full  mb-4 ml-4 pt-5 vidInfo rounded-lg ">
      <div className="flex flex-row justify-between w-full h-full">
        <div className="flex flex-row ml-5 justify-start w-full h-[100%]">
          <Link href={`/profile/${clip.ownerName}`}>
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
                <p className="mt-2 ml-1 text-xs text-slate-300 opacity-90">{date !== "0" ? `Posted ${date}d ago` : `Today`}</p>
              </div>
            </div>
          </Link>
          {authUser && authUser.id !== clipCurrent.ownerId._id && (
            <Button
              className=" ml-5 h-10 mt-2 followbutton"
              variant={!followed ? "outlined" : "outlined"}
              sx={{
                borderColor: !followed ? "rgb(168 85 247)" : "default",
                ":hover": {
                  borderColor: !followed ? "default" : "rgb(168 85 247)",
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
                className="mr-2 cursor-pointer mt-1"
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
              src={`/assets/icons/chat.png`}
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
  );
};

export default ClipInfo;
