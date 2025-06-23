const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  name: { type: String, required: true },

  age: {
    type: Number,
  },

  image: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dates: {
    type: String,
  },
  description: {
    type: String,
  },
});

const PostModel = model("Post", postSchema);
module.exports = PostModel;
