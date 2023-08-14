"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AuthContext } from "@components/authProvider";
import { ClipContext } from "@components/clipProvider";
import { useContext } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";
import { Button } from "@mui/material";
import MiniPlayer from "@components/MiniPlayer";
import { useParams } from "next/navigation";
import ProfileModal from "@components/Modal";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { authUser, session } = useContext(AuthContext);
  const { setClips } = useContext(ClipContext);
  const [profileDetails, setProfileDetails] = useState(null);
  const [edit, setEdit] = useState(null);
  const [current, setCurrent] = useState(null);
  const [fetch, setFetch] = useState(null);
  const [selected, setSelected] = useState("activity");

  const params = useParams();

  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await axios.get(
          `${baseUrl}api/profile/${params.username}`
        );
        console.log(profile.data);
        setProfileDetails(profile.data);
        if(authUser && params.username === authUser.username){
        setCurrent(profile.data.activity.reverse());
        } else { 
          setCurrent(profile.data.videos);
          setSelected('videos')
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
    console.log("Params:", params);
  }, [fetch]);

  useEffect(() => {
    if (profileDetails) console.log("Current videos:", current);
  }, [profileDetails]);

  const handleVideos = () => {
    setSelected("videos");
    setCurrent(profileDetails.videos);
  };

  const handleLikes = () => {
    setSelected("likes");
    setCurrent(profileDetails.liked);
  };

  const handleActivity = () => {
    setSelected("activity");
    setCurrent(profileDetails.activity);
  };
  const handleClip = (clip) => {
    const newClips = [];
    newClips.push(clip);
    setClips(newClips);
    router.push("/");
  };

  return profileDetails ? (
    <div className="flex flex-col w-[86%] ml-[14%] h-screen">
      <ProfileModal
        showModal={showModal}
        setShowModal={setShowModal}
        profileDetails={profileDetails}
        edit={edit}
        setEdit={setEdit}
        setFetch={setFetch}
        fetch={fetch}
      />
      <div className=" flex flex-row  pl-5">
        <Image
          alt="profile details"
          src={profileDetails.image}
          width={150}
          height={80}
        />
        <div className="flex flex-col ml-10">
          <h1 className="text-4xl">{profileDetails.username}</h1>
          <h1 className="text-xl mt-2">{profileDetails.email}</h1>
          {authUser && params.username === authUser.username && (
            <Button
              className="mr-5 h-10 mt-3 followbutton"
              variant={!edit ? "outlined" : "outlined"}
              sx={{
                borderColor: !edit ? "rgb(168 85 247)" : "default",
                ":hover": {
                  borderColor: !edit ? "default" : "rgb(168 85 247)",
                },
                color: !edit ? "white" : "white",
                marginTop: "10px",
              }}
              onClick={() => setShowModal((prev) => !prev)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-row mt-3 pl-3 ">
        <h1 className="ml-3">
          {profileDetails.following.length}{" "}
          <span className="text-gray-400">Following </span>{" "}
        </h1>
        <h1 className="ml-4">
          {profileDetails.followers.length}{" "}
          <span className="text-gray-400">Followers</span>
        </h1>
        <h1 className="ml-4">
          {profileDetails.liked.length}
          <span className="text-gray-400"> Likes</span>{" "}
        </h1>
      </div>
      <div className="mt-9 text-xl flex flex-row border-b border-slate-700  ">
      {authUser && params.username === authUser.username && 
        <div className="ml-3">
          <button
          onClick={handleActivity}
          className={`ml-3 mb-2 ${
            selected === "activity" ? "text-white border-b" : "text-gray-500"
          }  hover:text-white`}
        >
          Activity
        </button>
        </div>
          }
        <button
          onClick={handleVideos}
          className={`ml-5 mb-2 ${
            selected === "videos" ? "text-white border-b" : "text-gray-500"
          }  hover:text-white`}
        >
          Videos
        </button>
        <button
          onClick={handleLikes}
          className={`ml-5 mb-2 ${
            selected === "likes" ? "text-white border-b" : "text-gray-500"
          } hover:text-white`}
        >
          Likes
        </button>
      </div>

      <div className="flex flex-row flex-wrap">
        {selected === "activity" && <h1 className="ml-5 mt-4 text-xl">Recent:</h1> }
        {selected === "videos" &&
          current.map((clip) => {
            return <MiniPlayer clip={clip} key={clip.id} />;
          })}
            {selected === "likes" &&
          current.map((clip) => {
            return <MiniPlayer clip={clip} key={clip.id} />;
          })}
      </div>
      
      {selected === "activity" &&
        current.map((item) => {
          return (
            <div className="flex flex-col my-2 " key={item._id}>
              <div className="flex items-center pl-5">
                <Image
                  alt="video picture"
                  width={40}
                  height={40}
                  src={item.kind === "comment" ? `/assets/icons/chat.png` : `/assets/icons/heart.png` }
                />
                <p className="ml-3">
                  {item.user.username} left a {item.kind} on your{" "}
                  <span
                    className="border-b cursor-pointer font-semibold"
                    onClick={() => handleClip(item.video)}
                  >
                    video
                  </span>{" "}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  ) : (
    <div className=" flex justify-center items-center pt-20 w-[80%] ml-80 h-screen ">
      <h1 className="text-3xl">Loading...</h1>
    </div>
  );
};
export default Profile;
