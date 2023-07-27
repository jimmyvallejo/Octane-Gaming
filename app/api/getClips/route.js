import { connectToDB } from "@utils/database"
import Comment from "@models/comment"
import Video from "@models/video"



export const GET = async () => {
    try {
      connectToDB()

      const clips = await Video.find().populate("comments").populate("ownerId");

     
      return new Response(JSON.stringify({ clips: clips }), {
       status: 201,
     });

    } catch (error) {
        console.log(error)
    }
      
}