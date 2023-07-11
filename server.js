const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/user.model");

const port = 3000;

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb+srv://suzankarunga:Su24n@cluster0.vdqeyx1.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.post("/api/auth/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.get("/api/protected", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.userId;

    res.status(200).json({ message: "Protected route accessed" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});
app.delete("/api/user/delete-user", async (req, res) => {
  try {
    const { username } = req.body;
    console.log("username: ", username);
    // Find the user by username and delete it
    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }




  app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
  });
  