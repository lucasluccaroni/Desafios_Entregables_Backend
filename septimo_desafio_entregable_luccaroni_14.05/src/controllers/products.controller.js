module.exports = {

    getProducts: async (_, res) => {
        res.send({status: "success", payload: "getProducts"})
    },

    getProductById: async (req, res) => {
        res.send({status: "success", payload: "getProductsById"})
    },

    addProduct: async (_, res) => {
        res.send({status: "success", payload: "addProduct"})
    },

    updateProduct: async (req, res) => {
        res.send({status: "success", payload: "updateProduct"})
    },

    deleteProduct: async (req, res) => {
        res.send({status: "success", payload: "deleteProduct"})
    }
}