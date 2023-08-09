import { connectToDB } from "@utils/database";

import { User, Video, Comment } from "../models";
import jwt from "jsonwebtoken";

export const PUT = async (req) => {
  const { email, username, image, current } = await req.json();

  try {
    await connectToDB();

    const foundUsername = await User.findOne({ username });
    if (foundUsername) {
      return new Response("Username is already taken.", { status: 401 });
    }

    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      return new Response("Email is already taken.", { status: 401 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: current },
      {
        image: image,
        email: email,
        username: username,
      },
      { new: true }
    );

    const updateVideos = await Video.updateMany(
      { ownerName: current },
      { $set: { ownerName: username, image: image } }
    );

    const updateComments = await Comment.updateMany(
      { ownerName: current },
      { $set: { ownerName: username, ownerPic: image } }
    );

    console.log(updateVideos);
    console.log(updateComments);

    const payload = {
      id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      image: updatedUser.image,
      following: updatedUser.following,
      followers: updatedUser.followers,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "24hr",
    });

    return new Response(
      JSON.stringify({ token, id: updatedUser.id, payload }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return new Response("Failed to update User.", { status: 500 });
  }
};
