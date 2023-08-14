import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useContext } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";
import Image from "next/image";
import Link from "next/link";
import { ClipContext } from "./clipProvider";
import { useRouter } from "next/navigation";
import { Puff } from "react-loader-spinner";

const Search = () => {
  const [userResult, setUserResult] = useState(null);
  const [videoResult, setVideoResult] = useState(null);
  const [query, setQuery] = useState(null);
  const { setClips } = useContext(ClipContext);
  const [loading, setLoading] = useState(null);
  const [using, setUsing] = useState(null);
  const router = useRouter();

  const handleSearch = async () => {
    try {
        setUserResult(null)
        setVideoResult(null)
      setLoading(true);
      let searchResult = await axios.get(`${baseUrl}/api/search/${query}`);
      setUserResult(searchResult.data.users);
      setVideoResult(searchResult.data.videos);
      console.log(searchResult);
      setLoading((prev) => !prev);
    } catch (error) {
      console.log(error);
      setLoading((prev) => !prev);
    }
  };

  const handleClose = () => {
    setUserResult(null);
    setVideoResult(null);
    setQuery("");
  };

  const handleClip = (clip) => {
    const newClips = [];
    newClips.push(clip);
    setClips(newClips);
    router.push("/");
  };

  return (
    <div className="flex flex-col w-[20%] text-white ">
      <TextField
        id="search"
        type="search"
        className="flex justify-center"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        sx={{
          width: "100%",
          height: 40,
          backgroundColor: "#191b1f",
          ".MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            color: "white",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon
                onClick={handleSearch}
                sx={{ color: "grey", cursor: "pointer" }}
              />
            </InputAdornment>
          ),
        }}
      />

      <div className="absolute w-[20%] searchResult">
        {loading && (
          <div className={`flex justify-center items-center mt-5 mb-5`}>
            <Puff
              height="50"
              width="50"
              radius={1}
              color="rgb(168 85 247)"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              className={`flex justify-center items-center`}
            />
          </div>
        )}
        {userResult && videoResult && (
          <div>
            
            {videoResult.length === 0 && userResult.length === 0 && (
              <h1 className="text-center mt-10">No results found....</h1>
            )}
            <div className="mt-5">
              {videoResult.length > 0 && (
                <div className="mt-3 flex flex-col items-center w-full">
                  <h1 className=" text-xl border-b w-[20%] text-center font-light mb-3">Videos</h1>
                  {videoResult.map((video) => {
                    return (
                      <div
                        onClick={() => handleClip(video)}
                        key={video._id}
                        className="flex items-center mt-3  pl-3 w-full cursor-pointer hover:border h-20 rounded flex border  border-gray-800 hover:bg-gray-800 transition ease-in-out duration-300"
                       
                      >
                        <Image
                          alt="video"
                          width={50}
                          height={50}
                          src={video.image}
                        />
                        <h1 className="ml-3">{video.description}</h1>
                      </div>
                    );
                  })}
                </div>
              )}
              {userResult.length > 0 && (
                <div className="mt-5 flex flex-col items-center w-full">
                  <h1 className=" text-xl border-b w-[20%] text-center font-light mb-3">Users</h1>
                  {userResult.map((user) => {
                    return (
                      <Link
                        href={`${baseUrl}/profile/${user.username}`}
                        key={user._id}
                        className="flex items-center mt-3  pl-3 w-full cursor-pointer hover:border h-20 rounded flex border  border-gray-800 hover:bg-gray-800 transition ease-in-out duration-300"
                      >
                        <div className="flex flex-row items-center  ">
                          <Image
                            alt="user"
                            width={55}
                            height={55}
                            src={user.image}
                          />
                          <h1 className="ml-3" >{user.username}</h1>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <button
              onClick={handleClose}
              className="ml-[85%] text-white pb-2 pt-2"
            >
              Close
            </button>
          </div>
        )}
      </div>
     
    </div>
  );
};

export default Search;
