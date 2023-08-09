import { connectToDB } from "@utils/database";
import { User } from "../models";

export const POST = async (req) => {
  try {
    const { id } = await req.json();

    connectToDB();

    const userData = await User.findById(id)
      .populate("following")
      .populate("followers");

    return new Response(JSON.stringify({ userData: userData }), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
  }
};
