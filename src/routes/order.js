const express = require("express");
const router = express.Router();
const OrderProduct = require("../app/controlers/OrderController");

router.delete("/destroy-order", OrderProduct.deleteOrder);
router.post("/create/:id", OrderProduct.borrow);
router.get("/get-order", OrderProduct.getAllOrder);
router.get("/user-order/:id", OrderProduct.userBorrow);

module.exports = router;
