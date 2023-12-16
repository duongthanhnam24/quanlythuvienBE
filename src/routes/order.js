const express = require("express");
const router = express.Router();
const OrderProduct = require("../app/controlers/OrderController");

router.delete("/destroy-order", OrderProduct.deleteOrder);
router.post("/create/:id", OrderProduct.borrow);
router.post("/create-order", OrderProduct.createOrder);
router.get("/get-order", OrderProduct.getAllOrder);
router.get("/user-order/:id", OrderProduct.userBorrow);

module.exports = router;
