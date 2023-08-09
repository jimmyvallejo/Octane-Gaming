import { connectToDB } from "@utils/database";
import User from "@models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const POST = async (req, res) => {
  const { email, username, password } = await req.json();

  try {
    await connectToDB();

    if (!email || !password || !username) {
      return new Response("Please fill out all fields.", { status: 400 });
    }

    const foundUsername = await User.findOne({ username });
    if (foundUsername) {
      return new Response("Username is already taken.", { status: 401 });
    }

    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      return new Response("Email is already taken.", { status: 401 });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPass = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      email,
      username,
      password: hashedPass,
    });

    const payload = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      image: newUser.image,
      following: newUser.following,
      followers: newUser.followers,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "24hr",
    });

    console.log("Token:", token, "Payload:", payload);

    return new Response(JSON.stringify({ token, id: newUser._id, payload }), {
      status: 201,
    });
  } catch (error) {
    console.log(error);

    return new Response("Failed to create a new User.", { status: 500 });
  }
};
