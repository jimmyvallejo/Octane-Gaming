import { connectToDB } from "@utils/database";
import Video from "@models/video";
import Comment from "@models/comment";
import { User } from "../models";

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
      replies: [],
    });

    console.log("newComment:", newComment);

    const addToVideo = await Video.findByIdAndUpdate(
      clipId,
      { $push: { comments: newComment._id } },
      { new: true }
    ).populate("comments").populate('ownerId')

    console.log(addToVideo)


    const activityUpdate = {kind: "comment" , user: owner, video: addToVideo._id}

    const addToActivity = await User.findByIdAndUpdate(
      addToVideo.ownerId._id,
      { $push: { activity: activityUpdate} },
      { new: true }
    )

    console.log(addToActivity)

    return new Response(
      JSON.stringify({
        message: "Added Comment",
        newcomment: newComment,
        updatedvid: addToVideo,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response(error, { status: 500 });
  }
};
