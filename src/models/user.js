import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "SUPER_ADMIN"],
      default: "ADMIN",
    },
    permissions: {
      type: [String],
      enum: ["CREATE", "UPDATE", "DELETE"],
      default: [],
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
