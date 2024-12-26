import { Schema, model } from "mongoose";

const followSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: `User`,
  },
  follower: [
    {
      type: Schema.Types.ObjectId,
      ref: `User`,
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: `User`,
    },
  ],
});

const Follow_Model = model(`Follow` , followSchema)
export default Follow_Model
