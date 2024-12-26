import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio:{
      type:String,
    },
    imageDetails:{
      imageURL:{
        type:String
      },
      imageId:{
        type:String,
      }
    },
    DOB:{
      type:Date,
      default : null,
    }
  },
  { timestamps: true }
);

const User_Model = model("User", userSchema);
export default User_Model;
