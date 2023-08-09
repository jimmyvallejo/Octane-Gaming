import jwt from "jsonwebtoken";
export const POST = async (req) => {
  const { Token } = await req.json();

  try {
    if (!Token || Token === "null") {
      return new Response("Token not found"), { status: 400 };
    }

    const tokenInfo = jwt.verify(Token, process.env.SECRET);
    req.user = tokenInfo;
    return new Response(JSON.stringify(req.user), { status: 200 });
  } catch (error) {
    console.log(error.message, "Error.message");

    return (
      new Response("Internal Server Error: " + error.message), { status: 500 }
    );
  }
};
