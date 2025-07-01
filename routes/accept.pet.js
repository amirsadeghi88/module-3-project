const router = require("express").Router();
const UserModel = require("../models/User.model");
const PetModel = require("../models/Pet.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

router.post("/accept-pet/:postId", isAuthenticated, async (req, res) => {
  try {
    // first thing is to create salt

    await UserModel.findByIdAndUpdate(
      req.payload._id,
      {
        $push: { acceptedPets: req.params.postId },
      },
      { new: true }
    );
    const updatedUser = await UserModel.findById(req.payload._id).populate(
      "acceptedPets"
    );
    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
module.exports = router;
