'use client'
import React from 'react'
import Image from 'next/image'
import ReactPlayer from "react-player";

export const Clip = ({clip}) => {
  return (
    <div className="flex flex-col ">
      <div className=" flex flex-col items-center ">
        <div>
          <ReactPlayer
            url={clip.url}
            width={`760px`}
            height={`480px`}
            controls={true}
          />
        </div>
        <div className="flex flex-row justify-between w-[33%]">
          <div className="flex flex-row items-center">
            <Image
              src={`https://www.svgrepo.com/show/197325/eye.svg`}
              width={25}
              height={25}
              alt="views"
              className="mr-2"
            />
            <h3 className="text-xl">{clip.views}</h3>
          </div>
          <div className="flex flex-row items-center">
            <Image
              src={`https://www.svgrepo.com/show/513311/heart.svg`}
              width={25}
              height={25}
              alt="views"
              className="mr-2"
            />
            <h3 className="text-xl">{clip.likes}</h3>
          </div>
          <div className="flex flex-row items-center">
            <Image
              src={`https://www.svgrepo.com/show/336550/comment.svg`}
              width={35}
              height={35}
              alt="views"
              className="mr-2"
            />
            <h3 className="text-xl">{clip.comments.length}</h3>
          </div>
        </div>
        <div className="flex flex-row vidDet justify-between">
          <div className='flex  vidInfo'>
            <Image
              src={clip.image ? clip.image: `https://www.svgrepo.com/show/259535/game-controller.svg`}
              width={50}
              height={50}
              alt="user picture"
              className="mr-5 "
            />
            <div className="min-w-[80%] max-w-[80%]">
              <h1>{clip.ownerName}</h1>
              <p>{clip.description}</p>
            </div>
          </div>
          <button className="ml-4">Follow</button>
        </div>
      </div>
    </div>
  );
}
