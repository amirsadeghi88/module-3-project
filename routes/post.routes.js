const router = require("express").Router();
const { Router } = require("express");
const PostModel = require("../models/Post.model");
const uploader = require("../middlewares/cloudinary.config");

router.post("/add-post", uploader.single("imageUrl"), async (req, res) => {
  try {
    const createdPost = await PostModel.create({
      ...req.body,
      image: req.file?.path,
    });
    res.status(201).json(createdPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/user-post/:postId", async (req, res) => {
  const postOFTheUser = await PostModel.findById(req.params.postId);
  try {
    res.status(200).json(postOFTheUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/delete-post/:postId", async (req, res) => {
  const deletedPost = await PostModel.findByIdAndDelete(req.params.postId);
  try {
    res.status(200).json(deletedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/update-post/:postId", async (req, res) => {
  const updatedPost = await PostModel.findByIdAndUpdate(
    req.params.postId,
    req.body,
    { new: true }
  );
  try {
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/all-posts", async (req, res) => {
  try {
    const allPosts = await PostModel.find();
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
