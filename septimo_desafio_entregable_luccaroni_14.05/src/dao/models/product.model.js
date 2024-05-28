const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const schema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: String,
        required: true
    }
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model("Product", schema, "products")