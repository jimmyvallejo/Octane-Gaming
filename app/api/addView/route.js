import { connectToDB } from "@utils/database";
import Video from "@models/video";

export const POST = async (req) => {
  const { clipId } = await req.json();

  try {
    await connectToDB();

    const video = await Video.findById(clipId);

    console.log(video);

    const views = video.views + 1;

    console.log(views);

    await Video.findByIdAndUpdate(clipId, { views: views }, { new: true });

    return new Response(views.toString(), {
      status: 201,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    return new Response(error, { status: 500 });
  }
};
