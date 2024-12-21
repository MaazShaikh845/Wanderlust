const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMaongoose = require("passport-local-mongoose");

const userSchema = new Schema( {
    email: {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMaongoose);

module.exports = mongoose.model("User", userSchema);