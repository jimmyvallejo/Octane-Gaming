import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    post: {
      type: String,
    },
    owner: {
      type: String,
      unique: true,
    },
    likes: {
      type: Number,
    },replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
