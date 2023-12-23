const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete"); //  cho phép bạn thêm chức năng xóa mềm (soft delete) vào các bộ sưu tập của bạn.

const Book = new Schema(
    {
        name: { type: String, require: true },
        image: { type: String, required: true },
        position: { type: String, require: true },
        type: { type: String, required: true },
        author: { type: String, required: true },
        slot: { type: Number, required: true },
        slug: { type: String, slug: "name", unique: true }, // tự động thêm slug lấy từ name, unique để check slug ko bị trùng
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);
Book.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all", //  ghi đè lên các phương thức như find(), findeOne(),...
});
module.exports = mongoose.model("book", Book);
