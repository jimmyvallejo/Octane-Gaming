import { connectToDB } from "@utils/database";
import { Video } from "../models";

export const POST= async (req) => {
  try {
    const { id } = await req.json()
    console.log(id)
    
    connectToDB();

    const clipData = await Video.findById(id).populate("comments")

    return new Response(JSON.stringify({ clip: clipData }), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
  }
};
