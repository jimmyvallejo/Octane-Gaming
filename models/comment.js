import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    post: {
      type: String,
    },
    owner: {
      type: String,
    },
    ownerName :{
      type: String
    },
    ownerPic : {
      type:String
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

   const Comment = models.Comment || model("Comment", CommentSchema);
   export default Comment;
