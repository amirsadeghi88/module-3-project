const { isAuthenticated } = require("../middlewares/jwt.middleware");
const PetModel = require("../models/Pet.model");
const UserModel = require("../models/User.model");
const router = require("express").Router();
const uploader = require("../middlewares/Cloudinary.config");

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
      .populate("pets acceptedPets")
      .select("pets acceptedPets");
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

router.delete(
  "/delete-accepted-pet/:postId",
  isAuthenticated,
  async (req, res) => {
    try {
      const removeAcceptedPetFromUserArray = await UserModel.findByIdAndUpdate(
        req.payload._id,
        { $pull: { acceptedPets: req.params.postId } },
        { new: true }
      )
        .populate("acceptedPets")
        .select("username pets");
      res.status(200).json(removeAcceptedPetFromUserArray);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

router.put(
  "/update-pet/:petId",
  uploader.single("imageUrl"),
  async (req, res) => {
    try {
      const updatedPet = await PetModel.findByIdAndUpdate(
        req.params.petId,
        { ...req.body, image: req.file?.path },
        { new: true }
      );

      console.log("pet updated", updatedPet);
      res.status(200).json(updatedPet);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

router.get("/update-pet/:petId", async (req, res) => {
  try {
    const updatedPet = await PetModel.findById(req.params.petId);

    console.log("pet updated", updatedPet);
    res.status(200).json(updatedPet);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
