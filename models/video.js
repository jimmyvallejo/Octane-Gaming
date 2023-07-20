import { Schema, model, models } from "mongoose";

const VideoSchema = new Schema(
  {
    owner: {
      type: String,
      unique: true,
    },
    url: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    views: {
      type: Number,
    },
    likes: {
      type: Number,
    },
     comments: [{ type: Schema.Types.ObjectId, ref: "Comment"}]
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Video = models.Video || model("Video", VideoSchema);

export default Video;
