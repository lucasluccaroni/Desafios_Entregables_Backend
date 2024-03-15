//importo router
const { Router } = require("express")
const router = Router()

//importo el manager de Productos y declaro el path del JSON
const filename = `${__dirname}/../../assets/products.json`
const {ProductManager} = require("./productManager")
const productManager = new ProductManager(filename)


router.get("/", async(_, res) =>{
    try{
        await productManager.initialize()
        const products = await productManager.readProductsFromFile()
        const productsData = products.map(p => ({
            title: p.title,
            thumbnail: p.thumbnail,
            description: p.description,
            price: p.price,
            stock: p.stock,
            code: p.code,
            category: p.category,
            status: p.status,
            id: p.id
        }))
        
        res.render("realTimeProducts", {
            title: "Real Time Products",
            products: productsData,
            useWs: true,
            styles: ["realTimeProducts.css"],
            scripts: ["realTimeProducts.js"]

        })

    }
    catch(err){
        console.log("ERROR DEL GET - REALTIMEPRODUCTS.ROUTER.JS => " + err)
        res.status(500).send("Error interno del servidor.")
    }
})

//POST
router.post("/", async (req, res) =>{
    try{
        const {title, description, price, thumbnail, code, stock, status, category} = req.body
        const newProduct = {title, description,price,thumbnail,code,stock,status,category}
        
    
        await productManager.initialize()
        await productManager.readProductsFromFile()
        const productToAdd = productManager.addProduct(title, description, price, thumbnail, code, stock, status, category)

    
        if(productToAdd !== undefined){
            //notifico a los clientes mediante WS que se agregó un producto.
            req.app.get("ws").emit("newProduct", newProduct)
            res.status(301).redirect("/realtimeproducts")
            return
            
        }else{
            res.status(400).json({status: "error", message: "Hubo un error agregando el producto"})
        }
    }
    catch(err){
        console.log("ERROR EN POST =>", err)
    }
})


// DELETE
router.delete("/:pid", async (req, res) =>{
    try{
        const idParams = +req.params.pid
        console.log(` idparams = ${idParams}`)
        productManager.initialize()

        let products = await productManager.readProductsFromFile()

        await productManager.deleteProduct(idParams)

        products = await productManager.readProductsFromFile()

        //notifico a los clientes mediante WS que se eliminó un producto.
        res.app.get("ws").emit("productDeleted", products)
        res.status(301).redirect("/realtimeproducts")
    }
    catch(err){
        res.json(err)
    }
})

module.exports = router