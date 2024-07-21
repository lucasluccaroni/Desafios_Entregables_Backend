const { Router } = require("express")
const { userShouldBeAdmin, userIsLoggedIn, userShouldBeAdminOrPremium } = require("../middlewares/auth.middleware")

const { ProductsDAO } = require("../dao/mongo/products.dao")
const dao = new ProductsDAO()

const { ProductsService } = require("../service/products-service")
const service = new ProductsService(dao)

const { ProductsController } = require("../controllers/products.controller")
const controller = new ProductsController(service)


module.exports = () => {

    const router = Router()

    router.get("/", async (req, res) => {
        const products = await controller.getProducts(req, res)

        res.render("products", {
            title: "Products!",
            products
        })
    })

    router.get("/:pid", userIsLoggedIn, async (req, res) => {
        req.logger.info("Info de session en PRODUCT BY ID: ", req.session)

        const product = await controller.getProductById(req, res)

        res.render("productId", {
            title: "Product By Id",
            product
        })
    })

    router.post("/", /* userIsLoggedIn, userShouldBeAdminOrPremium, */ (req, res) => {
        controller.addProduct(req, res)
    })

    router.put("/:pid", userIsLoggedIn, userShouldBeAdmin, (req, res) => {
        req.logger.info("Info de session en UPDATE: ", req.session.user)

        controller.updateProduct(req, res)
    })

    router.delete("/:pid", userIsLoggedIn, userShouldBeAdminOrPremium, (req, res) => {
        controller.deleteProduct(req, res)
    })

    return router
}
