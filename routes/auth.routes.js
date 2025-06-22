const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAthenticated } = require("../middlewares/jwt.middleware");
//route to create a new user with encrypted password

router.post("/signup", async (req, res) => {
  try {
    // first thing is to create salt
    const theSalt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(req.body.password, theSalt);

    const createdUser = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//route to login an existing user

router.post("/login", async (req, res) => {
  try {
    const foundUser = await UserModel.findOne({ email: req.body.email });
    if (!foundUser) {
      res.status(400).json({ errorMessage: "Email does not exist" });
    } else {
      const doesPasswordMatch = bcryptjs.compareSync(
        req.body.password,
        foundUser.password
      );
      if (!doesPasswordMatch) {
        res.status(403).json({ errorMessage: "Password does not match" });
      } else {
        //this is the if statement when the email exist and password matches
        const data = { _id: foundUser._id, username: foundUser.username };
        //creating jwt token
        const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "365d",
        });
        res.status(200).json({ message: "You're logged in", authToken });
      }
    }

    res.status(200).json(foundUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// verify route to check if the token is valid

router.get("/verify", isAthenticated, (req, res) => {
  if (req.payload) {
    res.status(200).json({ message: "Token valid", payload: req.payload });
  } else {
    res.status(400).json({ errorMessage: "Problem with payload" });
  }
});

module.exports = router;
