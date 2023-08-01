"use client";
import { Clip } from "@components/Clip";
import { useContext, useState, useRef, useEffect} from "react";
import { ClipContext } from "@components/clipProvider";




const Home = () => {

  const {clips, getRandomClips} = useContext(ClipContext)
    const divRef = useRef(null);
  const [refresh, refreshCount] = useState(0)

  const lastClip = clips.length -1;


  const handleTop = () => {
 divRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }
  

    useEffect(() => {
      if (refresh > 0) {
        getRandomClips();
      } 
    }, [refresh]);

  return (
    <section>
      
      <div
        className=" relative overflow-y-auto overscroll-y-contain snap-y
        snap-mandatory snap-center h-screen no-scrollbar"
        ref={divRef}
      >
        {clips.map((clip, index) => {
          return (
            <Clip
              key={index}
              clip={clip}
              index={index}
              lastClip={lastClip}
              refresh={refresh}
              refreshCount={refreshCount}
              handleTop={handleTop}
            />
          );
        })}
      </div>
    </section>
  );
  
};

export default Home;
