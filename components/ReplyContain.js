import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { baseUrl } from "@utils/baseUrl";

const Reply = ({ reply }) => {
  
  const [date, setDate] = useState("")

  useEffect(() => {
    const currentDate = new Date();
    const timeStamp = new Date(reply.createdAt);
    const oneDay = 24 * 60 * 60 * 1000; 
     const differenceInDays = Math.floor((currentDate - timeStamp) / oneDay).toString();
     setDate(differenceInDays)
  },[])


  return (
    <div className=" flex items-start justify-start flex flex-col mt-5 mb-5">
      <Link className="cursor pointer" href={`${baseUrl}profile/${reply.ownerName}`}>
      <div className="flex">
        <Image
          src={reply.ownerPic}
          width={30}
          height={30}
          className="mr-3"
          alt="reply owner picture"
        />
        <h1 className="text-white"> {reply.ownerName} </h1>
      </div>
      <p className=" min-w-[87%] max-w-[87%]  rounded-md ml-11">{reply.post}</p>
      </Link>
      <div className="flex items-center mt-2.5 ml-1">
        <p className="text-xs text-slate-300 opacity-90">{date !== "0" ? `${date}d ago` : `Today`}</p>
      </div>
    </div>
  );
};

export default Reply;
