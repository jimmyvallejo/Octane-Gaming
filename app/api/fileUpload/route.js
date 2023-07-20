import Video from "@models/video"
import User from "@models/user";
import { connectToDB } from "@utils/database";
export const POST = async (req) => {
    const {name, url, owner} = await req.json()

     try {
        await connectToDB();

     if (!name || !url || !owner) {
       return new Response("Upload to Db failed.", { status: 400 });
     }

      
     const newVideo = await Video.create({
       owner,
       name,
       url,
       likes: 0,
       views: 1
     });

     const updatedArray = await User.findByIdAndUpdate(
       owner,
       { $push: { videos: newVideo._id } },
       { new: true }
     );

     return new Response(JSON.stringify({ Video: newVideo, UpdatedUser: updatedArray }), {
       status: 201,
     });

    } catch(error){
        console.log(error)
    }



}