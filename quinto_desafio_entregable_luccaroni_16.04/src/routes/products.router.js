const { Router } = require("express")
const ProductModel = require("../models/product.model")
const User = require("../models/user.model")

const router = Router()


// TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {

    try {

        //PRODUCTS
        const productManager = req.app.get("productManager")
        await productManager.initialize()
        let products = await productManager.getProducts()
        //console.log(products)

        //queries
        const limit = req.query.limit || 10
        const page = req.query.page || 1
        const sort = req.query.sort //asc o desc}

        // category y stock(disponibilidad)
        let query = {}
        if (req.query.category) {

            query.category = req.query.category

        } else if (req.query.stock) {

            query.stock = req.query.stock
        }


        products = await ProductModel.paginate(
            query,
            {
                sort: sort && { price: sort }, //asc o desc
                limit,
                page,
                lean: true
            }
        )



        //USER
        // info del user para renderizar
        console.log("Info de session en Home:", req.session.user)
        const idFromSession = req.session.user._id

        // Si tiene _id: 1 (porque es admin), importo los datos de admin y los renderizo.
        if (idFromSession == 1) {
            const user = req.session.user
            res.render("products", {
                title: "Products!",
                products,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    rol: user.rol
                }
            })

            // Si el _id != 1 , busco en la DB el user, traigo sus datos y los renderizo.
        } else {
            const user = await User.findOne(({ _id: idFromSession }))
            res.render("products", {
                title: "Products!",
                products,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    rol: user.rol
                }
            })
        }
    }

    catch (err) {
        console.log("Error in 'get' products =>", err)
    }
})


// PRODUCTO POR ID
router.get("/:pid", async (req, res) => {
    try {
        const productManager = req.app.get("productManager")
        const idProduct = req.params.pid
        let product = await productManager.getProductById(idProduct)

        if (!product) {
            res.status(404).json({ status: "error", message: `Product with ID: '${idProduct}' was not found.` })
            return
        }

        //console.log(product)
        res.render("productId", {
            title: "Search By ID",
            product
        })
    }
    catch (err) {
        console.log("Error in 'getProductByID' => ", err)
    }
})



// CREAR PRODUCTO
router.post("/", async (req, res) => {
    try {
        const productManager = req.app.get("productManager")

        const { title, description, price, thumbnail, code, stock, status, category } = req.body

        const newProduct = { title, description, price, thumbnail, code, stock, status, category }


        await productManager.addProduct(newProduct)
        res.json({ status: "success", newProduct: newProduct })
    }
    catch (err) {
        console.log("Error in 'addProduct' => ", err)
    }
})


// ACTUALIZAR PRODUCTO
router.put("/:pid", async (req, res) => {

    try {
        const productManager = req.app.get("productManager")
        const idParams = req.params.pid
        const productDataToUpdate = req.body

        //console.log(idParams)
        //onsole.log(productDataToUpdate)

        await productManager.updateProduct(idParams, productDataToUpdate)
        const productUpdated = await productManager.getProductById(idParams)

        res.send({ status: "success", message: "Product updated", productUpdated })
    }
    catch (err) {
        console.log("Error in 'updateProduct' => ", err)
    }

})


// BORRAR PRODUCTO
router.delete("/:pid", async (req, res) => {
    try {
        const productManager = req.app.get("productManager")
        const idParams = req.params.pid
        //console.log(idParams)

        await productManager.initialize()
        await productManager.deleteById(idParams)
        res.json({ status: "success", message: `Product with ID: '${idParams}' was succesfully removed.` })
    }
    catch (err) {
        console.log("Error in 'deleteById' => ", err)
    }

})

module.exports = router