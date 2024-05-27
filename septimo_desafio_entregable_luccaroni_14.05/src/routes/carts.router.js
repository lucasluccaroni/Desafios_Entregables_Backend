const { Router } = require("express")
const cartsController = require("../controllers/carts.controllers")

module.exports = () => {

    const router = Router()

    router.get("/", cartsController.getCarts)
    router.get("/:cid", cartsController.getCartById)
    router.post("/", cartsController.createCart)
    router.post("/:cid/product/:pid", cartsController.addProductToExistingCart)
    router.put("/:cid/carts/:pid", cartsController.updateProductFromExistingCart)
    router.put("/:cid", cartsController.updateArrayInCart)
    router.delete("/:cid/product/:pid", cartsController.deleteProductFromExistingCart)
    router.delete("/:cid", cartsController.clearCart)

    return router
}