const Category = require("../models/Category");

const getCategories = async (req, res) => {
  const categories = await Category.find({}).select("-tasks");
  return res.status(200).json(categories);
};

const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id).populate({
    path: "tasks",
    populate: {
      path: "user_id",
      select: "-password",
    },
  });
  return res.status(200).json(category);
};

const createCategory = async (req, res) => {
  const { name, description, image } = req.body;
  try {
    const category = await Category.create({
      name,
      description,
      image,
    });
    return res.status(201).json(category);
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
};
