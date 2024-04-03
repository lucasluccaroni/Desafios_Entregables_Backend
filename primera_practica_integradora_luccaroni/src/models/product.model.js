const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    price:{
        type: Number,
        required: true
    },

    thumbnail:{
        type: String,
        required: true
    },

    code:{
        type: String,
        required: true,
        unique: true
    },

    stock:{
        type: String,
        required: true
    },

    status:{
        type: Boolean,
        default: true,
        required: true
    },

    category: {
        type: String,
        required: true
    }
})

// virtuals
schema.virtual("id").get( function(){
    return this._id.toString()
})

module.exports = mongoose.model("Product", schema, "products")