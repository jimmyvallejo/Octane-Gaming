import { connectToDB } from "@utils/database"

import { Video } from "../models";



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