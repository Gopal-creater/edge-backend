import mongoose from "mongoose";

//Defining the user schema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
  },
  { timestamps: true }
);

//user method to check correct password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return candidatePassword === userPassword;
};

const User = mongoose.model("User", userSchema);
export default User;
