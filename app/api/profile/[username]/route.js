import { connectToDB } from "@utils/database";
import User from "@models/user";


export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    console.log(params);

    const profile = await User.findOne({ username: params.username })
    .populate("followers")
    .populate("following")
    .populate("videos")
    .populate("liked")
    .populate({
      path: "activity",
      populate: [
        {
          path: "user",
          model: "User",
        },
        {
          path: "video",
          model: "Video",
          populate: {
            path: "comments",
            model: "Comment",
          },
        },
      ],
    });

    return new Response(JSON.stringify(profile), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
  }
};
