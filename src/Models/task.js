const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // we're getting ObjectId from mongoose, because this is a Mongoose thing not a javascript thing like other types defined by a javascript object constructors (Boolean, String, Number etc)
      require: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

// We will use the approach of associating each task with the id of the user that created it. Another approach is to store the id's of all tasks in the user that created them.

//owner,creator,author,user any of this will do as a property that holds the id.
