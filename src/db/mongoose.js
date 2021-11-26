const mongoose = require("mongoose");

//Here we connect Mongoose to our database

//when we deploy to heroku it's not goint to be able to connect to this local database. That's why env.variables are handy, so they get automatically replaced. One value in dev. another in prod.

mongoose.connect(process.env.MONGODB_URL, {
  // useNewUrlParser: true,
  //useCreateIndex: true,
  autoIndex: true, //dont remove this. Can't remeber what is does exctly. check docs! The two above when active cause errors. Probably has to do with mongoos or mongodb verison.
});

// A single responibility pricicple. Mongoose connects to the database.

//Defining a basic version of the user model. Eventually they'll get more complex and live in their own files. This creates the database collection. The string defined inside model() should be singular. It will automatically be converted to plural --> users

//Here we have now created an instance of the model above.

// const user = new User({ name: "  Milizza   ", email: "  SHMULA@hotmail.com", password: "lucky" });

//This instance has methods which we can use to save or do other operatons on our instances/documents to out database
