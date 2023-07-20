import { connectToDB } from "@utils/database"
import Video from "@models/video"
import User from "@models/user"
export const GET = async () => {
    try {
      connectToDB()

      const clips = await Video.find()

     

    
     


      return new Response(JSON.stringify({ clips: clips }), {
       status: 201,
     });

    } catch (error) {
        console.log(error)
    }
      
}