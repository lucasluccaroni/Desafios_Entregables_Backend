const { Router } = require("express")
const router = Router()

//importo el manager de Productos y declaro el path del JSON
const filename = `${__dirname}/../../assets/products.json`
const {ProductManager} = require("./productManager")
const productManager = new ProductManager(filename)



router.get("/", async(req, res) =>{
    try{
        await productManager.initialize()
        const products = await productManager.readProductsFromFile()
        
        res.render("home", {
            title: "TEST!",
            products
        })

    }
    catch(err){
        console.log("ERROR DEL GET - HOME.ROUTER.JS => " + err)
    }

})

module.exports = router