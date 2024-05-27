module.exports = {

    getCarts: async (_, res) => {
        res.send({status: "success", payload: "getCarts"})
    },

    getCartById: async (req, res) => {
        res.send({status: "success", payload: "getCartById"})
    },

    createCart: async (_, res) => {
        res.send({status: "success", payload: "createCart"})
    },

    addProductToExistingCart: async (req, res) => {
        res.send({status: "success", payload: "addProductToExistingCart"})
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