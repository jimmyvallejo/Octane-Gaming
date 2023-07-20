import Video from "@models/video"
import User from "@models/user";
import { connectToDB } from "@utils/database";
export const POST = async (req) => {
    const {description, url, ownerId, ownerName, image} = await req.json()
    console.log(ownerId)
    console.log(ownerName)

     try {
        await connectToDB();

     if (!description || !url || !ownerId) {
       return new Response("Upload to Db failed.", { status: 400 });
     }

      
     const newVideo = await Video.create({
      image, 
       ownerId,
       ownerName,
       description,
       url,
       likes: 0,
       views: 1
     });

    

     const updatedArray = await User.findByIdAndUpdate(
       ownerId,
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