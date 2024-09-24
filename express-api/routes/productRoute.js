const express = require("express");
const {
  postProduct,
  productList,
  productDetails,
  updateProducts,
  deleteProduct,
} = require("../controller/productController");
const { requireAdmin } = require("../controller/authController");
const router = express.Router();

router.post("/postproduct", requireAdmin,postProduct);
router.get("/productlist", productList);
router.get("/productdetails/:id", productDetails);
router.put("/updateproduct/:id", requireAdmin,updateProducts);
router.delete("/deleteproduct/:id", requireAdmin,deleteProduct);

module.exports = router;
