import { connectToDB } from "@utils/database";
import User from "@models/user";
import Video from "@models/video";

export const GET = async (req, { params }) => {
 await connectToDB
  
    try {
 

    console.log(params);

    const users = await User.find({ $text: { $search: params.query } })
    const videos = await Video.find({ $text: { $search: params.query } }).populate('comments').populate("ownerId")

    return new Response(JSON.stringify({users: users, videos: videos}), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
  }
};
