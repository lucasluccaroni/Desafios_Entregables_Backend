const { Router } = require("express")
const productsController = require("../controllers/products.controller")

module.exports = () => {

    const router = Router()

    router.get("/", productsController.getProducts)
    router.get("/:pid", productsController.getProductById)
    router.post("/", productsController.addProduct)
    router.put("/:pid", productsController.updateProduct)
    router.delete("/:pid", productsController.deleteProduct)

    return router
}