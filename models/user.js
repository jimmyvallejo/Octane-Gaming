import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Username is required!"],
      match: [
        /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        "Username invalid, it should contain 4-20 alphanumeric letters and be unique!",
      ],
      unique: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    liked: [{ type: Schema.Types.ObjectId, ref: "Video" }]
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
