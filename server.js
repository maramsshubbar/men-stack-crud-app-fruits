// Import modules
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Log connection status
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import the Fruit model
const Fruit = require("./models/fruit.js");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Home
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

// GET /fruits - Index
app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();

  console.log(allFruits);

  res.render("fruits/index.ejs", { fruits: allFruits });
});

// GET /fruits/new - New
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// GET /fruits/:fruitId/edit - Edit page
app.get("/fruits/:fruitId/edit", async (req, res) => {
  try {
    const foundFruit = await Fruit.findById(req.params.fruitId);

    res.render("fruits/edit.ejs", { fruit: foundFruit });
  } catch (err) {
    console.log(err);
    res.send("Unable to edit fruit");
  }
});

// GET /fruits/:fruitId - Show
app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);

  res.render("fruits/show.ejs", { fruit: foundFruit });
});

// POST /fruits - Create
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  await Fruit.create(req.body);

  res.redirect("/fruits");
});

// PUT /fruits/:fruitId - Update
app.put("/fruits/:fruitId", async (req, res) => {
  try {
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }

    await Fruit.findByIdAndUpdate(
      req.params.fruitId,
      req.body,
      { new: true }
    );

    res.redirect(`/fruits/${req.params.fruitId}`);
  } catch (err) {
    console.log(err);
    res.send("Unable to update fruit");
  }
});

// DELETE /fruits/:fruitId - Delete
app.delete("/fruits/:fruitId", async (req, res) => {
  try {
    await Fruit.findByIdAndDelete(req.params.fruitId);

    res.redirect("/fruits");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Listening on port 3000");
});