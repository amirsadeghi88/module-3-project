const { Schema, model } = require("mongoose");

const petSchema = new Schema({
  name: { type: String, required: true },

  age: {
    type: Number,
  },

  image: {
    type: String,
    default:
      "data:image/jpeg;base64,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",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const PetModel = model("pet", petSchema);
module.exports = PetModel;
