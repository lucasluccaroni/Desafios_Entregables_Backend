const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String,
    rol: {
        type: String,
        default: "user"
    },
    cart: String
})

module.exports = mongoose.model("User", schema, "users")