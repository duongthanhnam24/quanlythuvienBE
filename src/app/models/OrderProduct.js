const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete"); //  cho phép bạn thêm chức năng xóa mềm (soft delete) vào các bộ sưu tập của bạn.

const order = new Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            image: { type: String, required: true },
            type: { type: String, required: true },
            author: { type: String, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            isBorrow: { type: Boolean, default: true },
            dateBorrow: { type: String, require: true },
        },
    ],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
});

module.exports = mongoose.model("order", order);
