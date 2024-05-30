const { Products } = require("../dao")
const productsDAO = new Products()

//TODO: PONER LOS RENDERS DE PRODUCTS ACA PARA PARA QUE SEAN LLAMADOS POR ROUTES

module.exports = {

    getProducts: async (_, res) => {
        
        const result = await productsDAO.getProducts()
        if (!result) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(result)
    },

    getProductById: async (req, res) => {
        // res.send({status: "success", payload: "getProductsById"})
        const id = req.params.pid

        const product = await productsDAO.getProductById(id)
        if (!product) {
            return product === false
                ? res.sendError({message: "Not Found"}, 404)
                : res.sendError({message: "Something went wrong!"})
        }

        res.sendSuccess(product)
    },

    addProduct: async (req, res) => {
        // res.send({status: "success", payload: "addProduct"})
        const productData = req.body

        const newProduct = await productsDAO.addProduct(productData)
        if (!newProduct) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(newProduct)
    },

    updateProduct: async (req, res) => {
        // res.send({status: "success", payload: "updateProduct"})
        const id = req.params.pid
        const productData = req.body

        const updatedProduct = await productsDAO.updateProduct(id, productData)
        if (!updatedProduct) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(updatedProduct)
    },

    deleteProduct: async (req, res) => {
        // res.send({status: "success", payload: "deleteProduct"})

        const id = req.params.pid

        const deletedProduct = await productsDAO.deleteProduct(id)
        if (!deletedProduct) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(deletedProduct)
    }
}
