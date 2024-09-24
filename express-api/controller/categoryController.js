const Category = require("../models/categoryModel")

// to post category in database
exports.postCategory = async (request, response) => {
  let category = new Category({
    category_name: request.body.category_name
  })
  // Check if category name already exists in database
  Category.findOne({ category_name: category.category_name })
    .then(async (data) => {
      if (data == null) {
        category = await category.save()

        if (!category) {
          return response.status(400).json({ error: "Something went wrong" })
        }
        response.send(category)
      } else {
        return response
          .status(400)
          .json({ error: "category name must be unique" })
      }
    })
    .catch((err) => {
      return response
        .status(400)
        .json({ error: "category name must be unique" })
    })
}

// to show all category list
exports.showCategoryList = async (request, response) => {
  const category = await Category.find()
  if (!category) {
    return response.status(400).json({ error: "Something went wrong" })
  }
  response.send(category)
}

// to fetch category details
exports.categoryDetails = async (request, response) => {
  const category = await Category.findById(request.params.id)
  if (!category) {
    return response.status(400).json({ error: "Something went wrong" })
  }
  response.send(category)
}

//to update category
exports.updateCategory = async (request, response) => {
  const category = await Category.findByIdAndUpdate(
    request.params.id,
    {
      category_name: request.body.category_name
    },
    {
      new: true //to show updated value in result.
    }
  )
  if (!category) {
    return response.status(400).json({ error: "Something went wrong" })
  }
  response.send(category)
}

//to delete category
exports.deleteCategory = (request, response) => {
  Category.findByIdAndDelete(request.params.id)
    .then((category) => {
      if (!category) {
        return response.status(403).json({ error: "category not found" })
      } else {
        return response.status(200).json({ msg: "category deletd" })
      }
    })
    .catch((err) => {
      return response.status(400).json({ error: err })
    })
}
