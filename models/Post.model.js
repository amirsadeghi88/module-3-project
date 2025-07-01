const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  name: { type: String, required: true },

  age: {
    type: Number,
  },

  image: {
    type: String,
    default:
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/65761296352685.5eac4787a4720.jpg",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
