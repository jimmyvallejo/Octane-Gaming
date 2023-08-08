"use client";
import { useEffect, createContext, useState } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";



const ClipContext = createContext();

const ClipProvider = ({ children }) => {

    const [uploadcount, setuploadCount] = useState(0)
    const [contextLikes, setcontextLikes] = useState(null)
    const [commentAmount, setCommentAmount] = useState(null)
    const [loading, setLoading] = useState(null)

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
      }
    }
    

    const [clips, setClips] = useState([]);

    const getRandomClips = async () => {
      try {
        setLoading(true)
        setClips([])
        const result = await axios.get(`${baseUrl}api/getClips`);
        console.log(result.data);

        let clipsArray = result.data.clips.slice(0,9);
        shuffleArray(clipsArray);

        setClips(clipsArray);
        setLoading(null)
      } catch (error) {
        setLoading(null);
        console.log(error);
      }
    };

      const getClips = async () => {
        try {
           setLoading(true);
           setClips([])
          const result = await axios.get(`${baseUrl}api/getClips`);
         
          let clipsArray = result.data.clips.slice(0, 9).reverse();
          setClips(clipsArray);
          setLoading(null);
        } catch (error) {
          setLoading(null);
          console.log(error);
        }
      };
    
    useEffect(() => {
      getClips();
    }, [uploadcount]);


 

  return (
    <ClipContext.Provider value={{ clips, setuploadCount, contextLikes, setcontextLikes, commentAmount, setCommentAmount, getClips, getRandomClips, loading, setLoading }}>
      {children}
    </ClipContext.Provider>
  );
};

export { ClipContext, ClipProvider };
