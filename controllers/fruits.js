const Fruit = require("../models/fruit");

const index = async (req, res) => {
  const foundFruits = await Fruit.find();

  console.log(foundFruits);

  res.render("fruits/index.ejs", { fruits: foundFruits });
};

const showNewForm = (req, res) => {
  res.render("fruits/new.ejs");
};

const create = async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  await Fruit.create(req.body);

  res.redirect("/fruits");
};

const show = async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);

  res.render("fruits/show.ejs", { fruit: foundFruit });
};

const edit = async (req, res) => {
  try {
    const foundFruit = await Fruit.findById(req.params.fruitId);

    res.render("fruits/edit.ejs", { fruit: foundFruit });
  } catch (err) {
    console.log(err);
    res.send("Unable to edit fruit");
  }
};

const update = async (req, res) => {
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
};

const deleteFruit = async (req, res) => {
  try {
    await Fruit.findByIdAndDelete(req.params.fruitId);

    res.redirect("/fruits");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  index,
  showNewForm,
  create,
  show,
  edit,
  update,
  deleteFruit,
};