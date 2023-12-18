const express = require("express");
const router = express.Router();
const ProductController = require("../app/controlers/ProductController");
const { authMiddleWare } = require("../app/Middleware/authMiddleware");

router.delete("/delete-product/:id", ProductController.deleteProduct); // xóa sản phẩm
router.patch("/update-product/:id", ProductController.updateProduct); // cập nhật product
router.post("/create-product", ProductController.createProduct); // tạo product
router.get("/panigated/search", ProductController.PanigatedSearch); // lấy product theo từng page và search
router.get("/:id", ProductController.getProduct); // lấy ra product theo id
// router.get("/", authMiddleWare, ProductController.getAllProduct); // lấy all products
router.get("/", ProductController.getAllProduct); // lấy all products

module.exports = router;
