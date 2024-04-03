//Configuracion de router + fs
const {Router} = require("express")
const router = Router()


// GET todos los productos o ?limit
router.get("/", async (req, res) =>{
    try{
        const productManager = req.app.get('productManager')
        await productManager.initialize()
        const products = await productManager.getProducts()

        //query limit
        const {limit} = req.query
        if(limit){
            const result = products.slice(0, limit)
            res.status(200).json({message: "success", result})
            return
        }

        //si no hay query devuelve todos los productos
        res.status(200).json({message: "success", products})
        return
    }
    catch(err){
        res.status(500).json({status: "error", message: "Error trayendo productos"})
    }
})



// GET por ID
router.get("/:pid", async(req, res) =>{
    try{
        const productManager = req.app.get('productManager')

        //traigo el id de params y busco el product con el metodo de clase correspondiente
        const idProduct = req.params.pid
        const productToSend = await productManager.getProductById(idProduct)

        //si no existe, lo informo al cliente
        if(!productToSend){
            res.status(400).json({status: "error", message: `Error. Producto no encontrado. ID: ${idProduct}`})
            return
        }

        res.send({status: "success", id: idProduct, product: productToSend})
        return

    }
    catch(err){
        console.log(err)
        res.send({error: "Error buscando producto por ID"})
        return
    }
})


//POST
router.post("/", async (req, res) =>{
    try{
        const productManager = req.app.get('productManager')
        await productManager.initialize()
        console.log(req.body)

        //traigo los params para cargar el producto
        const {title, description, thumbnail, price, code, stock, status, category} = req.body
        

        const newProduct = {title, description, thumbnail, price, code, stock, status, category}

        await productManager.addProduct(req.body)

        res.json({message: "success", newProduct})
        return
    }
    catch(err){
        console.log(err)
        return
    }
})



//PUT
router.put("/:pid", async (req, res)=>{

    const productManager = req.app.get('productManager')
    const idProduct = req.params.pid
    const productDataToUpdate = req.body

    console.log(idProduct)
    console.log(productDataToUpdate)

    await productManager.updateProduct(idProduct, productDataToUpdate)

    const productUpdated = await productManager.getProductById(idProduct)

    res.send({status: "success", message: "Producto actualizado", productUpdated})
})




//DELETE
router.delete("/:pid", async (req, res)=>{
    try{
        const productManager = req.app.get('productManager')
        await productManager.deleteById(+req.params.pid)

        res.status(200).json({ success: true })
    }
    catch(err){
        console.log("error borrando el producto", err)
        return res.status(500).json({ error: "Hubo un error borrando el producto" })
    }  
})

module.exports = router