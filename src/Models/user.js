const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../Models/task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      dropDups: true, //this solved the issue together with unique
      required: true,
      trim: true,
      lowercase: true, //makes it lowercase?
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },

    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age is invalid!");
        }
      },
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain 'password'!");
        }
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

//We will setup a virtual property. It's not data stored in the database. It's a relationship between two enteties.

userSchema.virtual("mytasks", {
  ref: "Task",
  localField: "_id", // ObjectId
  foreignField: "owner", // value is an ObjectId  localField and foreignFiled have matching id's. Thats how we create the relationship
});

//Two available methods on the schema

//userSchema.pre();
//userSchema.post();

//methods go on instances

// We're running this method just before user (which is converted autmatically to Json) is sent from server the express server.
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject(); // Mongoose method. Why are we doing this? We're converting a user (Json format) to an object in order to delete some user data.
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

//methods go on instances

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET); //we have embedded user id as part of the token. we use toString() on ObjectId()
  user.tokens = user.tokens.concat({ token }); //concat does NOT mutate arrays. It creates a new one!
  user.save(); //here we are saving again in database
  return token;
};

// statics go on constructors

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  //keep in mind toJSON method above is removing password and tokens from user. They should never be exposed to the user. Only the last token created which will be used in fron end

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password); //compare plain text password with hashed password in database. Behind the scenes bcrypt will hash the password enetered as plain txt

  if (!isMatch) {
    throw new Error("Unable to login"); //Best have generic error. Don't tell them that email was correct but password failed, giving them more info than neccessary
  }

  return user;
};
//use statics property  to define custom methods which will be available on User constructor.

//It has to be a regular function because of 'this'. And the binding thing
//next is a function which we call at the end. Without it wouldn't know when to proceed and save user. It would hang on indefinetly

//It will work for creating the user but not for updating the user because of the method used findByIdAndUpdate() in the router, it bypasses the middleware. It performs a direct operation on the database, thats why we had to set explicitly "runValidators" option. You have to change this method in the user router.

//hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  //the code below will run only when user is saved for the first time and if password has been modified. We don't want to hash the password twice

  // If we get an unhashed password the code below will run. isModifed() checks for that. We get an unhashed passowrd only when user signs up and when user modifies password. If user modifies only the email we will not hash the password again, because it hasnt been modified.

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user tasks when user is removed (when user deletes their account)

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
