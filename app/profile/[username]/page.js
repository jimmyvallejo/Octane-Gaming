"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AuthContext } from "@components/authProvider";
import { useContext } from "react";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";
import { Button } from "@mui/material";
import MiniPlayer from "@components/MiniPlayer";
import { useParams } from 'next/navigation'
import ProfileModal from "@components/Modal";

const Profile = () => {
  const { authUser } = useContext(AuthContext);
  const [profileDetails, setProfileDetails] = useState(null);
  const [edit, setEdit] = useState(null);
  const [currentVideos, setCurrentVideos] = useState(null)
  const [fetch, setFetch] = useState(null)
  const [selected, setSelected] = useState(true)

  const params = useParams()

  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    if (profileDetails) console.log("Current videos:", currentVideos);
  }, [profileDetails]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await axios.get(
          `${baseUrl}api/profile/${params.username}`
        );
        setProfileDetails(profile.data);
        setCurrentVideos(profile.data.videos);
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
    console.log("Params:", params)
  }, [fetch]);

  const handleVideos = () => {
    setSelected(prev => !prev)
    setCurrentVideos(profileDetails.videos)
  }

  const handleLikes = () => {
    setSelected(prev => !prev)
    setCurrentVideos(profileDetails.liked)
  }

 

  return profileDetails ? (
    <div className="flex flex-col w-[86%] ml-[14%] h-screen">
      <ProfileModal showModal={showModal} setShowModal={setShowModal} profileDetails={profileDetails} edit={edit} setEdit={setEdit} setFetch={setFetch} fetch={fetch} />
      <div className=" flex flex-row  pl-5">
        <Image src={profileDetails.image} width={150} height={80} />
        <div className="flex flex-col ml-10">
          <h1 className="text-4xl">{profileDetails.username}</h1>
          <h1 className="text-xl mt-2">{profileDetails.email}</h1>
          {params.username === authUser.username && <Button
            className="mr-5 h-10 mt-3 followbutton"
            variant={!edit ? "outlined" : "outlined"}
            sx={{
              borderColor: !edit ? "rgb(168 85 247)" : "default",
              ":hover": {
                borderColor: !edit ? "default" : "rgb(168 85 247)",
              },
              color: !edit ? "white" : "white",
              marginTop: "10px"
            }}
            onClick={() => setShowModal(prev => !prev)}
          >
            Edit Profile
          </Button>
}
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
      <div className="mt-9 text-xl flex flex-row border-b border-slate-700 pl-5 ">
        <button
          onClick={handleVideos}
          className={`ml-3 mb-2 ${selected ? "text-white border-b" : "text-gray-500"}  hover:text-white`}
        >
          Videos
        </button>
        <button
          onClick={handleLikes}
          className={`ml-6 mb-2 ${!selected ? "text-white border-b" : "text-gray-500"} hover:text-white`}
        >
          Likes
        </button>
      </div>

      <div className="flex flex-row flex-wrap">
        {currentVideos &&
          currentVideos.map((clip) => {
            return <MiniPlayer clip={clip} key={clip.id} />;
          })}
      </div>
    </div>
  ) : (
    <div className=" flex justify-center items-center pt-20 w-[80%] ml-80 h-screen ">
      <h1 className="text-3xl">Loading...</h1>
    </div>
  );
};
export default Profile;
