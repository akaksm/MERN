// import the model
const Product = require("../models/productModel")

// to post product or to insert data
exports.postProduct = async (request, response) => {
  let product = new Product({
    product_name: request.body.product_name,
    product_price: request.body.product_price,
    countInStock: request.body.countInStock,
    product_description: request.body.product_description,
    product_image: request.body.product_image,
    category: request.body.category
  })

  product = await product.save()

  if (!product) {
    return res.status(400).json({ error: "Something went wrong" })
  }

  response.send(product)
}

//to show all product list
exports.productList = async (request, response) => {
  const product = await Product.find().populate("category")
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" })
  }

  response.send(product)
}

//Product details
exports.productDetails = async (request, response) => {
  const product = await Product.findById(request.params.id).populate("category")
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  response.send(product)
}

//update product
exports.updateProducts = async (request, response) => {
  const product = await Product.findByIdAndUpdate(
    request.params.id,
    {
      product_name: request.body.product_name,
      product_price: request.body.product_price,
      countInStock: request.body.countInStock,
      product_description: request.body.product_description,
      product_image: request.body.product_image,
      category: request.body.category
    },
    { new: true }
  )
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" })
  }

  response.send(product)
}

// delete product
exports.deleteProduct = async (request, response) => {
  Product.findByIdAndDelete(request.params.id)
    .then((product) => {
      if (!product) {
        return response.status(403).json({ error: "category not found" })
      } else {
        return response.status(200).json({ msg: "category deletd" })
      }
    })
    .catch((err) => {
      return response.status(400).json({ error: err })
    })
}
