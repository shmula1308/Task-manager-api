const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../Models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

const router = new express.Router();

const upload = multer({
  // dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
      return cb(new Error("File must be one of the following: jpg, jpeg or png"));
    }

    cb(undefined, true);
  },
});

// Create user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save(); // Here we're saving it to database, without adding a token to tokens array.
    sendWelcomeEmail(user.email, user.name); // here we know that validation just worked. That's why we place this line here
    const token = await user.generateAuthToken(); //who called generateAuthToken()? user instance called it, therefore it can be accessed by this in generateAuthToken() method. generateAuthToken() apart from returning a token, in the background also saves the user to database after adding the token to tokens array.
    res.status(201).send({ user, token }); //Keep in mind that toJSON method removes password and tokens array before sending user.
  } catch (e) {
    res.status(400).send(e);
  }
  // try/catch with async/await above replaces the code below. We did this for all the routes.

  // user
  //   .save()
  //   .then(() => {
  //     res.status(201).send(user);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e); // It's important to send status code before you send error res.send(e). You can also chain them.
  //     //   res.send(e);
  //   });
});

// Keep in mind that users can be logged in many different devices at the same time. So everytime we login we generate a new authToken
// It is a POST method for security reason. Read further. Remeber you are posting new data from the form email and password usually

// Login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password); //We can define custom methods on schemas. Called model methods,statics property holds them
    const token = await user.generateAuthToken(); // We can define custom methods on instances. Sometimes called instance methods
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// Here we insert auth in the middle, it will run before our route handler runs. Only if we call next, then the route handler will run.
//Token should be provided with request header (not body). Also when server responds, it can provide additional info with header.

// Logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// Logout all users

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(); //sends a 200 by default if things went well
  } catch (e) {
    res.status(500).send();
  }
});

// Read profile

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// The route below is not needed. It was just to explain the concepts of :id placeholder. We should never expose the id of a user, or make it possible for them to get or delete others users

// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.send(500).send();
//   }
// });

// In general routes for updating resources will be a lot more complex

// Update user

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid update!" });
  }
  try {
    const user = req.user;

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // if (!user) {
    //   res.status(404).send();
    // }
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

// Delete user

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).send();
    // }

    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

// const expressMiddleware = (req, res, next) => {
//   res.send(new Error("Middleware error"));
// };

// Route for Creating and updating avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    //this fourth argument need to have this call signature, it expects:(error,req,res,next). This is what lets express know to handle any uncaught errors
    res.status(400).send(error.message);
  }
);

// Route for wiping the avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

// Serving up the avatar. We havent created any new request in postman for this

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png"); //here we have to specify a header. When we were serving json, express did it for us.
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
