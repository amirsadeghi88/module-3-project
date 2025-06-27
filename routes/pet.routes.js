const { isAuthenticated } = require("../middlewares/jwt.middleware");
const PetModel = require("../models/Pet.model");
const UserModel = require("../models/User.model");
const router = require("express").Router();
const uploader = require("../middlewares/cloudinary.config");

//route to create a pet and then add that pet to an array inside the user
router.post(
  "/add-pet",
  isAuthenticated,
  uploader.single("imageUrl"),
  async (req, res) => {
    const theOwnerId = req.payload._id;
    try {
      const createdPet = await PetModel.create({
        ...req.body,
        owner: theOwnerId,
        image: req.file?.path,
      });
      const updatedUser = await UserModel.findByIdAndUpdate(
        theOwnerId,
        {
          $push: { pets: createdPet._id },
        },
        { new: true }
      );
      console.log("pet created", createdPet);
      console.log("user updated", updatedUser);
      res.status(201).json({ createdPet, updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

//route to get one pet for one specific user
router.get("/user-pets", isAuthenticated, async (req, res) => {
  try {
    const petsOfTheUser = await UserModel.findById(req.payload._id)
      .populate("pets")
      .select("pets");
    res.status(200).json(petsOfTheUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//route to remove a pet from DB
router.delete("/delete-pet/:petId", isAuthenticated, async (req, res) => {
  try {
    const deletedPet = await PetModel.findByIdAndDelete(req.params.petId);
    const removePetFromUserArray = await UserModel.findByIdAndUpdate(
      req.payload._id,
      { $pull: { pets: req.params.petId } },
      { new: true }
    )
      .populate("pets")
      .select("username pets");
    res.status(200).json({ removePetFromUserArray });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
