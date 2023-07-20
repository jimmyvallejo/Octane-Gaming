"use client";
import { Clip } from "@components/clip";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";

const Home = () => {
  const [clips, setClips] = useState([])
  
  useEffect(() => {
    const getClips = async () => {
      try {
         const result = await axios.get(`${baseUrl}api/getClips`)
          console.log(result.data)
          setClips(result.data.clips)
      } catch {

      }
    }

    getClips()
  }, []);

  return (
    <section className="mb-5">
      {clips.map((clip, index) => {
        return <Clip key={index} clip={clip} />;
      })}
    </section>
  );
};

export default Home;
