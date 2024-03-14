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
            code: p.code
        }))
        
        res.render("realTimeProducts", {
            title: "Real Time Products",
            products: productsData,
            useWs: true,
            styles: ["realTimeProducts.css"]

        })

    }
    catch(err){
        console.log("ERROR DEL GET - HOME.ROUTER.JS => " + err)
        res.status(500).send("Error interno del servidor.")
    }

})
module.exports = router