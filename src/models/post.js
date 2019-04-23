import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    pid: {
      type: String,
      required: true,
      unique: true
    },
    content: {
      type: String
    },
    title: { type: String, required: true },
    category: { type: String },
    author: [
      {
        author: { type: String },
        description: { type: String },
        contact: { type: String }
      }
    ],
    picture: [
      {
        picID: { type: String },
        description: { type: String },
        path: { type: String },
        picdate: { type: String }
      }
    ],
    published: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Post", schema);
