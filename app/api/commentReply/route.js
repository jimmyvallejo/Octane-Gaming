import { connectToDB } from "@utils/database";
import Video from "@models/video";
import Comment from "@models/comment";

export const POST = async (req) => {
  const { owner, post, commentId, ownerName, ownerPic } = await req.json();

  try {
    await connectToDB();

    const newReply = await Comment.create({
      owner: owner,
      ownerName: ownerName,
      ownerPic: ownerPic,
      post: post,
      likes: [],
      replies: [],
    });
 

    const addToComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: newReply._id } },
      { new: true }
    ).populate("replies");

    return new Response(
      JSON.stringify({
        message: "Added Reply",
        newReply: newReply,
        updatedComment: addToComment,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response(error, { status: 500 });
  }
};
