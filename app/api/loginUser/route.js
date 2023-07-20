import { connectToDB } from "@utils/database";
import User from "@models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req, res) => {
  const { email, password } = await req.json();
  try {
    await connectToDB();
    if (!email || !password) {
      return new Response("Please fill out all fields.", { status: 400 });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return new Response("Email is incorrect.", { status: 401 });
    }

    const doesMatch = await bcrypt.compare(password, foundUser.password);

    if(!doesMatch) {
        return new Response("Password is incorrect.", {
          status: 401,
        });
    }

    if (doesMatch) {
      const payload = {
        id: foundUser._id,
        email: foundUser.email,
        username: foundUser.username,
        image: foundUser.image
      };
      const token = jwt.sign(payload, process.env.SECRET, {
        algorithm: "HS256",
        expiresIn: "24hr",
      });
      return new Response(
        JSON.stringify({ token, id: foundUser.id, payload }),
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    console.log(error);
    return new Response("Failed to login.", { status: 500 });
  }
};
