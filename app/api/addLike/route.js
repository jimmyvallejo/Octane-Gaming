import { connectToDB } from "@utils/database";
import Video from "@models/video";
import User from "@models/user";

export const POST = async (req) => {
  const { clipId, userId } = await req.json();

  try {
    await connectToDB();

    const foundUser = await User.findById(userId);

    if (foundUser.liked.includes(clipId)) {
      const removedLike = await User.findByIdAndUpdate(
        userId,
        { $pull: { liked: clipId } },
        { new: true }
      );

      const removedVideoLike = await Video.findByIdAndUpdate(
        clipId,
        { $pull: { likes: userId } },
        { new: true }
      ).populate("comments");

      return new Response(
        JSON.stringify({
          removed: true,
          message: "Liked video was removed",
          userlike: removedLike,
          videolike: removedVideoLike,
        }),
        { status: 201 }
      );
    } else {
      const addLike = await User.findByIdAndUpdate(
        userId,
        { $push: { liked: clipId } },
        { new: true }
      );
      const addVideoLike = await Video.findByIdAndUpdate(
        clipId,
        { $push: { likes: userId } },
        { new: true }
      ).populate("comments");

      return new Response(
        JSON.stringify({
          removed: false,
          message: "Added to likes",
          userlike: addLike,
          videolike: addVideoLike,
        }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
  }
};
