const { Carts } = require("../dao")
const cartsDAO = new Carts()

module.exports = {

    getCarts: async (_, res) => {
        // res.send({status: "success", payload: "getCarts"})
        const result = await cartsDAO.getCarts()
        if (!result) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(result)
    },

    getCartById: async (req, res) => {
        const id = req.params.pid

        const cart = await cartsDAO.getCartById(id)
        if (!cart) {
            return cart === false
                ? res.sendError({message: "Not Found"}, 404)
                : res.sendError({message: "Something went wrong!"})
        }

        res.sendSuccess(cart)
    },

    createCart: async (_, res) => {
        // res.send({status: "success", payload: "createCart"})
        const newCart = await cartsDAO.createCart()
        if (!newCart) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(newCart)
    },

    addProductToExistingCart: async (req, res) => {
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body

        console.log("PRODUCT QUANTITY => ", quantity )

        const result = await cartsDAO.addProductToExistingCart(cartId, productId, quantity)
        if (!result) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(result)
        
    },

    updateProductFromExistingCart: async (req, res) => {
        res.send({status: "success", payload: "updateProductFromExistingCart"})
    },

    updateArrayInCart: async (req, res) => {
        res.send({status: "success", payload: "updateArrayInCart"})
    },

    deleteProductFromExistingCart: async (req, res) => {
        res.send({status: "success", payload: "deleteProductFromExistingCart"})
    },

    clearCart: async (req, res) => {
        res.send({status: "success", payload: "clearCart"})
    }
}