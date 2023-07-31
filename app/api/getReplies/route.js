import { connectToDB } from "@utils/database";
import { Comment } from "../models";

export const POST= async (req) => {
  try {
    const { commentId } = await req.json()
    
    connectToDB();

    const replies = await Comment.findById(commentId).populate("replies")

    return new Response(JSON.stringify({ replies: replies.replies }), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
  }
};
