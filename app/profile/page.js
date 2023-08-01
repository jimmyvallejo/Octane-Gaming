'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { AuthContext } from '@components/authProvider';
import { useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '@utils/baseUrl';
import { Button } from '@mui/material';

const Profile = () => {
  
    const {authUser} = useContext(AuthContext)
    const [profileDetails, setProfileDetails] = useState(null)
    const [edit, setEdit] = useState(null)

    useEffect(() => {
        console.log(profileDetails)
    },[profileDetails])

    useEffect(() => {
        const getProfile = async () => {
            try {
                const profile= await axios.get(`${baseUrl}api/profile/${authUser.username}`)
                setProfileDetails(profile.data)
            } catch(error) {
                console.log(error)
            }
        }
        getProfile()
    },[])
  
return profileDetails ? (
  <div className="flex flex-col pt-20 w-[80%] ml-80 ">
    <div className=" flex flex-row ">
      <Image src={profileDetails.image} width={150} height={80} />
      <div className="flex flex-col ml-10">
        <h1 className="text-3xl">{profileDetails.username}</h1>
        <h1 className="text-xl mt-2">{profileDetails.email}</h1>
        <Button
          className="mr-5 h-10 mt-3 followbutton"
          variant={!edit ? "outlined" : "outlined"}
          sx={{
            borderColor: !edit ? "#6c0736" : "default",
            ":hover": {
              borderColor: !edit ? "default" : "#6c0736",
            },
            color: !edit ? "white" : "white",
          }}
          onClick={() => setEdit(!edit)}
        >
          Edit Profile
        </Button>
      </div>
    </div>
    <div className="flex flex-row mt-3 ">
      <h1 className="ml-3">{profileDetails.following.length} Following </h1>
      <h1 className="ml-4">{profileDetails.followers.length} Followers </h1>
      <h1 className="ml-4">{profileDetails.liked.length} Likes </h1>
    </div>
  </div>
) : (
  <div className=" flex justify-center items-center pt-20 w-[80%] ml-80 h-screen ">
    <h1 className='text-3xl'>Loading...</h1>
  </div>
);
    }
export default Profile