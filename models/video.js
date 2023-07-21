import { Schema, model, models } from "mongoose";

const VideoSchema = new Schema(
  {
    ownerId: {
      type: String,
      unique: true,
    },
    ownerName: {
      type: String,
      unique: true,
    },
    image: {
       type: String
    },
    url: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    views: {
      type: Number,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Video = models.Video || model("Video", VideoSchema);

export default Video;
