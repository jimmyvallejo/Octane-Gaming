import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { ClipContext } from "./clipProvider";
import { useContext } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";

import Link from "next/link";

const MiniPlayer = ({ clip }) => {
  const { setClips } = useContext(ClipContext);

  const handleSingle = async () => {
    try {
      const result = await axios.post(`${baseUrl}api/getClip`, {
        id: clip._id,
      });

      let clipSingle = [];
      clipSingle.push(result.data.clip);
      setClips(clipSingle);
    } catch (error) {
      console.log(error);
    }
  };

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
        <Link
          onClick={handleSingle}
          className="text-white font-semibold opacity-80 vidDets mr-1 hover:animate-pulse"
          href={`/`}
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default MiniPlayer;
