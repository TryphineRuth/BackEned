// require packages
const express = require("express");
const mongoose = require("mongoose");
// const userRoutes = require("./routes/userRoutes");
// const authRoutes = require("./routes/authRoutes");
const User = require("./models/user.model");
const bodyParser = require("body-parser");
const { signup, signin } = require("./controllers/auth_controller");

const port = 3000

// initialise express
const app = express();
app.use(express.json());
// app.use("user", userRoutes);
// app.use("auth", authRoutes);

//  mondodb connect
mongoose
  .connect("mongodb+srv://admin:Truth@cluster0.69xowuj.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// create a schema
// const studentSchema = new mongoose.Schema({
//   roll_no: Number,
//   name: String,
//   year: Number,
//   subjects: [String]
// });

// Create a new document
// const user = new User({
//   userID: 1001,
//   username: "Madison Hyde",
//   email: "madison@gmail.com",
//   password: "madison123#",
// });
// const user2 = new User({
//   userID: 1001,
//   username: "Suzan Joan",
//   email: "tryphyn@gmail.com",
//   password: "suzajophine123#",
// });
// Add the document to Collections
// user.save().then(
//   () => console.log("One entry added"),
//   (err) => console.log(err)
// );
// user2.save().then(
//   () => console.log("Two entry added"),
//   (err) => console.log(err)
// );
// Save method can also be written as:
// stud.save((err, result) => {
//     if(err) console.log(err);
//     else console.log("entry added");
// });

// get documents
app.post("/users", (req, res) => {
  console.log("ourData: ", req.body);

  User.find()
    .then((ourData) => {
      return res.status(200).json({
        ourData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: err.message,
      });
    });

  // return routes

  // Student.find((err, found) => {
  //     if (!err) {
  //         res.send(found);
  //     } else {
  //         console.log(err);
  //         res.send("Some error occured!")
  //     }
  // }).catch(err => console.log("Error occured, " + err));
});

app.post("/api/auth/signup", (req, res) => {
  signup(req, res);
});

app.post("/api/auth/signin", (req, res) => {
  signin(req, res);
});

// Server listen
app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});

