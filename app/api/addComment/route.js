import { connectToDB } from "@utils/database";
import Video from "@models/video";
import Comment from "@models/comment";

export const POST = async (req) => {
  const { owner, post, clipId, ownerName, ownerPic } = await req.json();

  try {
    await connectToDB();

    const newComment = await Comment.create({
      owner: owner,
      ownerName: ownerName,
      ownerPic: ownerPic,
      post: post,
      likes: [],
      replies: []

    });

    console.log("newCOmment:", newComment);

    const addToVideo = await Video.findByIdAndUpdate(
      clipId,
      { $push: { comments: newComment._id } },
      { new: true }
    ).populate("comments");

    return new Response(
        JSON.stringify({
          message: "Added Comment",
          newcomment: newComment,
          updatedvid: addToVideo,
        }),
        { status: 201 }
      );
    
  } catch (error) {
      return new Response(error, { status: 500 });
  }
};
