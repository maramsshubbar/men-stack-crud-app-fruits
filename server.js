const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");

const fruitsCtrl = require("./controllers/fruits");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/fruits", fruitsCtrl.index);
app.get("/fruits/new", fruitsCtrl.showNewForm);
app.post("/fruits", fruitsCtrl.create);
app.get("/fruits/:fruitId", fruitsCtrl.show);
app.get("/fruits/:fruitId/edit", fruitsCtrl.edit);
app.put("/fruits/:fruitId", fruitsCtrl.update);
app.delete("/fruits/:fruitId", fruitsCtrl.deleteFruit);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});