const express = require("express");
require("./db/mongoose"); // you have to run mongoose here too. Mongoose connects to the database server when the express server is up and running, thus creating a link between node app and database
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
// /Users/shpendmula/mongodb/bin/mongod --dbpath=/Users/shpendmula/mongodb-data --> start the database server and set the path where data will be saved
const port = process.env.PORT; //we access PORT variable when heroku provides the environment variable. We will set it up also for our local variables for security reasons and customizability.

const app = express(); // here we create the server

app.use(express.json()); //We are customizing our express server.This one line parses incoming json files to javascript objects. They are now accessible in our req.body
app.use(userRouter);
app.use(taskRouter);

// Without middleware: new request -> run route handler

// With middleware: new request -> do something -> run route handler

app.listen(port, () => {
  console.log("Server is up and running on port " + port);
});

//https://shpend-task-manager.herokuapp.com/

// const jwt = require("jsonwebtoken");

// const myfunction = () => {
//   const token = jwt.sign({ _id: "Red123!" }, "obladioblada", { expiresIn: "5 minutes" });

//   console.log(token);

//   const decoded = jwt.verify(token, "obladioblada");
//   console.log(decoded);

//   //error invalid signature
// };

// myfunction();

// const User = require("./Models/user");

// const main = async () => {
//   const user = await User.findById("619385527140d3add1826763");
//   await user.populate("mytasks"); // no need to call execPopulate() anymore in new version of mongoose i guess?
//   console.log(user.mytasks);
// };

// main();

const multer = require("multer");

const upload = multer({
  dest: "images", //folder where they will be stored
  limits: {
    fileSize: 1000000, //bytes -> 1mb
  },
  fileFilter(req, file, cb) {
    // three parameters req, file being uploaded and cb[callback] to tell multer when we're done filtering
    // cb(new Error("File must be pdf")); if there is an error we use the callback
    // cb(undefined, true); //with this we accept the upload
    // cb(undefined, false); //with this we reject the upload

    // if (!file.originalname.endsWith(".pdf")) {
    //   return cb(new Error("Please upload a PDF"));
    // }

    // with regExp
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error("Please upload a Word document"));
    }
    //this logic says, I only accept word files files. I'll filter everything else out, unless it's a word file
    cb(undefined, true);
  },
});

//filefilter property filters out the files we dont want to have uploaded. And the value is a function, setup using ES6 definition for functions. Will be called internally by multer and it will provide us with three arguments

// const expressMiddleware = (req, res, next) => {
//   res.send(new Error("Middleware error"));
// };

//when using postman or fetching from the browser the key needs to be named exactly like it has been specified inside function single("upload")
app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);
