import React, { useEffect } from "react";
import Image from "next/image";

const Reply = ({ reply }) => {

    useEffect(() => {
        console.log(reply)
    },[])

  return (
    <div className=" flex items-start justify-start flex flex-col mt-5 mb-5">
      <div className="flex">
        <Image
          src={reply.ownerPic}
          width={30}
          height={30}
          className="mr-3"
        />
        <h1 className="text-white"> {reply.ownerName} </h1>
      </div>
      <p className=" min-w-[87%] max-w-[87%]  rounded-md ml-11">
        {reply.post}
      </p>
      <div className="flex items-center mt-2.5 ml-1">
        <p className="text-xs">2d ago</p>
      </div>
    </div>
  );
};

export default Reply;
