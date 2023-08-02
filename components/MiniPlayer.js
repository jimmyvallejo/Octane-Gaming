import React from 'react'
import ReactPlayer from "react-player";

import Link from 'next/link';

const MiniPlayer = ({ clip }) => {
  
  
  
    return (
      <div className=" flex-col items-start justify-start my-1 mx-1 ">
        <ReactPlayer
          url={clip.url}
          width={"270px"}
          height={`140px`}
          controls={true}
          playing={false}
        />
        <div className="flex flex-row justify-between font-light">
          <p className="ml-2 ">{clip.description.slice(0, 15)}...</p>
          <Link className='text-white font-semibold opacity-80 vidDets mr-1 hover:animate-pulse' href={`/video`}>Details</Link>
        </div>
      </div>
    );
}

export default MiniPlayer