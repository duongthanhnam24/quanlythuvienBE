const mongoose = require("mongoose");
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
        // access_token: { type: String, required: true },
        // refresh_token: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);

module.exports = mongoose.model("user", user);
