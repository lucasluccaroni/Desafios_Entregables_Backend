const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    products:{
        type: Object,
        required: true
    }
})

// virtuals
schema.virtual("id").get( function(){
    return this._id.toString()
})

module.exports = mongoose.model("Cart", schema, "carts")