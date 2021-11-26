const jwt = require("jsonwebtoken");
const User = require("../Models/user");

//it has access to all the information of route handler, request and response objects plus next
//its your job to run next() if the next thing in the chain should run (zinxhir). If we're not going to call next( from our middleware it's a good idea to send a response saying why things aren't working as expected. Middleware should be created in a separate file to keep things organized. Middleware folder: middleware is going to store a new file for each piece of middleware we're trying to define. In real world we don't want middleware to run for every route, so we should not define it index.js. We will define them in sepcific route files.

// app.use((req, res, next) => {
//   console.log(req.method, req.path);
// });

// app.use((req, res) => {
//   res.status(503).send("Service temp unavailable!");
// });

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // this retrn an object with few properties. One of them is _id:

    const user = await User.findOne({ _id: decoded._id, "tokens.token": token }); //tokens array needs to contain the token(user still logged in) and _id. Both need to match!

    if (!user) {
      throw new Error();
    }
    req.token = token; // Here we attach the token that was provided.
    req.user = user; // Here we attach the user object we have found to the request object, so that router wouldnt have to find it again
    next();
  } catch (e) {
    res.status(401).send("Please authenticate");
  }
};

module.exports = auth;
