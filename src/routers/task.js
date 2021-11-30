const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../Models/task");

const router = new express.Router();

// Create new task
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send();
  }
  // try/catch with async/await above replaces the code below

  // task
  //   .save()
  //   .then(() => {
  //     res.status(201).send(task);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e);
  //   });
});

// Get all tasks. Optionally get only completetd ones or not completed ones

// GET tasks?completed=true
// GET tasks?limit=10&skip=20

// GET tasks?sortBy=createdAt:desc || asc
// GET tasks?sortBy=completed:desc||asc

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const tasks = await Task.find({ owner: req.user._id }); //gets the job done as well
    // const user = req.user;
    // await user.populate({
    //   path: "mytasks",
    //   match,
    //   options: {
    //     limit: parseInt(req.query.limit),
    //     skip: parseInt(req.query.skip),
    //   },
    //   sort,
    // });
    // res.send(user.mytasks);
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
  // try/catch with async/await above replaces the code below

  // Task.find({})
  //   .then((tasks) => {
  //     res.send(tasks);
  //   })
  //   .catch((e) => {
  //     res.status(500).send();
  //   });
});

// Get a single task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send(); // Here we only send a 404. We dont't want to say that task exists by you are not the owner of that task.
    }
    res.send(task);
  } catch (e) {
    res.status(404).send();
  }

  // try/catch with async/await above replaces the code below

  // Task.findById(_id)
  //   .then((task) => {
  //     // if (!task) {
  //     //   return res.status(404).send();
  //     // }
  //     res.send(task);
  //   })
  //   .catch((e) => {
  //     if (Object.keys(e.reason).length === 0) {
  //       res.status(404).send();
  //     } //possible workaround
  //     res.status(404).send();
  //   });
});

// Update a single task

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(404).send({ error: "Invalid Update!" });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save(); // But why are we making this change, we're not running any middleware here?
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// Delete a single task

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
