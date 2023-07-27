import { connectToDB } from "@utils/database";
import User from "@models/user";

export const POST = async (req) => {
  const { clipOwner, currentUser } = await req.json();

  try {
    await connectToDB();

    const clipUser = await User.findById(clipOwner);
    const authUser = await User.findById(currentUser);

    console.log(clipUser);
    console.log(authUser);

    if (authUser.following.includes(clipOwner)) {
      const removedFollowing = await User.findByIdAndUpdate(
        currentUser,
        { $pull: { following: clipOwner } },
        { new: true }
      );

      const removedClipOwnerFollower = await User.findByIdAndUpdate(
        clipOwner,
        { $pull: { followers: currentUser } },
        { new: true }
      );

      return new Response(
        JSON.stringify({
          removed: true,
          message: "Follow was removed",
          updatedCurrent: removedFollowing,
          updatedClipUser: removedClipOwnerFollower,
        }),
        { status: 201 }
      );
    } else {
      const addFollowing = await User.findByIdAndUpdate(
        currentUser,
        { $push: { following: clipOwner } },
        { new: true }
      );
    
       const addClipOwnerFollower = await User.findByIdAndUpdate(clipOwner, {
         $push: { followers: currentUser } },
         {new: true}
       );
        return new Response(
          JSON.stringify({
            removed: false,
            message: "Follow was Added",
            updatedCurrent: addFollowing,
            updatedClipUser: addClipOwnerFollower,
          }),
          { status: 201 }
        );
    }


  } catch (error) {
    console.log(error);
  }
};
