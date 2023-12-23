const mongoose = require("mongoose");
const MongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");

const user = new Schema(
    {
        name: { type: String, required: true },
        msv: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        checkpassword: {
            type: String,
            required: true,
        },
        isAdmin: { type: Boolean, default: false, required: true },
        phoneNumber: { type: String, required: true },
        punish: { type: Boolean, default: false, require: true },
        classs: { type: String },
        // access_token: { type: String, required: true },
        // refresh_token: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);
user.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: "all", //  ghi đè lên các phương thức như find(), findeOne(),...
});
module.exports = mongoose.model("user", user);
