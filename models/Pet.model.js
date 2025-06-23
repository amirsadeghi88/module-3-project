const { Schema, model } = require("mongoose");

const petSchema = new Schema({
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
});

const PetModel = model("Pet", petSchema);
module.exports = PetModel;
