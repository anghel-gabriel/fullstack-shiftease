import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  emailAddress: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: String, required: true },
  gender: { type: Object },
  userRole: { type: String },
  photoURL: {
    type: String,
    default: "http://localhost:8080/pictures/defaultPhoto.png",
  },
});

const User = mongoose.model("User", userSchema);
export default User;
