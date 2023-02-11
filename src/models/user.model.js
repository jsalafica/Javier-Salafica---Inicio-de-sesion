import { model, Schema } from "mongoose";

const userSchema = Schema({
  email: { type: String },
  password: { type: String },
});

export const User = model("user", userSchema);
