const { Router } = require("express")

const { ProductsDAO } = require("../dao/mongo/products.dao")
const dao = new ProductsDAO()

const { ProductsService } = require("../service/products-service")
const service = new ProductsService(dao)

const { ProductsController } = require("../controllers/products.controller")
const controller = new ProductsController(service)

module.exports = ()  => {

    const router = Router()

    router.get("/",  async (req, res) => {
        const products =  await controller.getProducts(req, res)
        // console.log("PRODUCTS ROUTER => ", products)
        res.render("products", {
            title: "Products!",
            products
        })
    })
    
    router.get("/:pid", async (req, res) => {
        const product = await controller.getProductById(req, res)
        
        res.render("productId", {
            title: "Product By Id",
            product
        })
    })
    
    router.post("/", (req, res) => {
        controller.addProduct(req, res)
    })

    router.put("/:pid", (req, res) => {
        controller.updateProduct(req, res)
    })

    router.delete("/:pid", (req, res) => {
        controller.deleteProduct(req, res)
    })

    return router
}