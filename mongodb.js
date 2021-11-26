//CRUD Create, read,update and delete
// /Users/shpendmula/mongodb/bin/mongod --dbpath=/Users/shpendmula/mongodb-data --> telling mongodB where to store data/also starting up mongodb database server.
// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// Because we using mongoose we're not using this file.

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

// const id = new ObjectID();

// console.log(id);
// console.log(id.id.length);
// console.log(id.toHexString().length);
// console.log(id.getTimestamp());

// MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
//   if (error) {
//     return console.log("Unable to connect to database!");
//   }

//   const db = client.db(databaseName); //Get the database you want to manipulate, you manipulator! But also create it if it is not created!

//   //search mongodb operators for a list of all available operators $set is one of them
//   // db.collection("users")
//   //   .updateOne(
//   //     { _id: new ObjectID("617bc25899780d7fd3ff5327") },
//   //     {
//   //       $inc: {
//   //         age: 1,
//   //       },
//   //     }
//   //   )
//   //   .then((result) => {
//   //     console.log(result);
//   //   })
//   //   .catch((error) => {
//   //     console.log(error);
//   //   });

//   // db.collection("tasks")
//   //   .updateMany(
//   //     { completed: false },
//   //     {
//   //       $set: {
//   //         completed: true,
//   //       },
//   //     }
//   //   )
//   //   .then((result) => {
//   //     console.log(result);
//   //   })
//   //   .catch((error) => {
//   //     console.log(error);
//   //   });

//   // db.collection("users")
//   //   .deleteMany({
//   //     age: 33,
//   //   })
//   //   .then((result) => {
//   //     console.log(result);
//   //   })
//   //   .catch((error) => {
//   //     console.log(error);
//   //   });

//   db.collection("tasks")
//     .deleteOne({
//       task: "Go to work!",
//     })
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((error) => {
//       console.log(error);
//     });

//   // db.collection("users").findOne({ _id: new ObjectID("617bc25899780d7fd3ff5327") }, (error, user) => {
//   //   if (error) {
//   //     return console.log(error);
//   //   }
//   //   console.log(user);
//   // });

//   // db.collection("users")
//   //   .find({ age: 33 })
//   //   .toArray((error, users) => {
//   //     console.log(users);
//   //   });
//   // //returns a cursor that has multiple methods and properties. If you need a count or array. No need to store an array in memory if all you need is a count

//   // db.collection("users")
//   //   .find({ age: 33 })
//   //   .count((error, count) => {
//   //     console.log(count);
//   //   });

//   // db.collection("tasks").findOne({ _id: ObjectID("617d15714a07e32e043f59ee") }, (error, user) => {
//   //   if (error) {
//   //     return console.log(error);
//   //   }

//   //   console.log(user);
//   // });
//   // db.collection("tasks")
//   //   .find({ completed: false })
//   //   .toArray((error, tasks) => {
//   //     if (error) {
//   //       return console.log(error);
//   //     }

//   //     console.log(tasks);
//   //   });

//   // db.collection("users").insertOne(
//   //   {
//   //     name: "Ismail",
//   //     age: 31,
//   //   },
//   //   (error, result) => {
//   //     if (error) {
//   //       return console.log("Unable to insert user!");
//   //     }
//   //     console.log(result);
//   //   }
//   // );

//   //   db.collection("users").insertMany(
//   //     [
//   //       { name: "Sebahate", age: null },
//   //       { name: "Arber", age: null },
//   //     ],
//   //     (error, result) => {
//   //       if (error) {
//   //         return onsole.log("Unable to insert users!");
//   //       }
//   //       console.log(result);
//   //     }
//   //   );
//   // db.collection("tasks").insertMany(
//   //   [
//   //     { task: "Go to work!", completed: false },
//   //     { task: "Learn Strapi", completed: false },
//   //     { task: "Study React", completed: true },
//   //   ],
//   //   (error, result) => {
//   //     if (error) {
//   //       return console.log("Unable to insert tasks!");
//   //     }
//   //     console.log(result);
//   //   }
//   // );
// });
