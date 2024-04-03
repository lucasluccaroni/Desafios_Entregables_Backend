//Configuracion de Router
const {Router} = require("express")
const router = Router()


//importo el productManager + el JSON de productos para poder buscar el producto con POST
const {ProductManager} = require("../dao/fileManagers/productManager")
const productFiles = `${__dirname}/../../assets/products.json`
const productManager = new ProductManager(productFiles)



//POST
router.post("/", async (_, res)=>{
    try{
        const cartManager = req.app.get("cartManager")

        const cart = await cartManager.readCartFromFile()
        console.log(cart)

        //Crea un carrito vacio con un Id random irrepetible
        const newCart = {id: cartManager.getRandomId(), products: []}
        const {id} = newCart

        cart.push(newCart)
        cartManager.updateCartFile(id, cart)

        res.send({status: "success", message: "Carrito creado con exito", nuevoCarrito: newCart})
    }
    catch(err){
        return []
    }
})



//GET cid
router.get("/:cid", async (req, res)=>{
    try{
        const cartManager = req.app.get("cartManager")
        const idParams = +req.params.cid
        
        //Leo el carrito y uso el metodo para buscar por ID
        const carts = await cartManager.readCartFromFile()
        const cartToSend = await cartManager.getCartById(idParams)
        //console.log(cartToSend)
        
        //Valido si existe un cart con ese ID
        if(!cartToSend){
            res.status(400).json({status: "error", message: `Error. Carrito no encontrado. ID: ${idParams}`})
            return
        }
        res.send({status: "success", cart: cartToSend})
        return

    }
    catch(err){
        console.log(`ERROR leyendo el archivo => ${err}`)
    }
})


//POST /:cid/product/p:id
router.post("/:cid/products/:pid", async (req, res) =>{
    try{
        const cartManager = req.app.get("cartManager")

        //traigo los params
        const cartParams = +req.params.cid
        const productParams = req.params.pid
        //console.log(`carrito: ${cartParams}, producto: ${productParams}`)
        
        //busco carrito seleccionado
        const carts = await cartManager.readCartFromFile()
        const cartSelected = await cartManager.getCartById(carts, cartParams)
        //console.log(cartSelected)

        //valido que exista el cart
        if(!cartSelected){
            res.status(400).json({status: "error", message: `Error. Carrito no encontrado. ID: ${cartParams}`})
            return
        }
        

        //busco producto seleccionado
        await productManager.initialize()
        await productManager.readProductsFromFile()
        const productSelected = productManager.getProductById(productParams)
        console.log(productSelected)

        //valido que exista el product
        if(!productSelected){
            res.status(400).json({status: "error", message: `Error. Producto no encontrado. ID: ${productParams}`})
            return
        }

        //valido si el producto ya esta en el carrito
        if(!cartSelected.products.some(p => p.product == productParams)){
            //Si el producto no esta, lo agrego al carrito, actualizo el archivo y doy respuesta al cliente
            const result = cartSelected.products.push({product: productSelected.id , quantity: 1} )
            carts.push(result)
            cartManager.updateCartFile(carts)
            res.send({status: "success", message: "Producto añadido!", cartSelected})
            return

        } else if(cartSelected.products.some(p => p.product == productParams)){
            //Si el producto esta, busco su posicion en el array de productos 
            console.log("el producto ya se encuentra en el carrito");
            
            //busco el index
            let indexProducto = cartSelected.products.findIndex(p => p.product == productParams)
            //console.log(indexProducto)

            // suma 1 a la cantidad del producto dentro del carrito seleccionado
            cartSelected.products[indexProducto].quantity += 1 

            //actualizo el archivo y mando la response al cliente
            cartManager.updateCartFile(carts)
            res.send({status: "success", message: "Se añadió 1 unidad mas del producto!",cartSelected})
            return
        }
    }
    catch(err){
        console.log(`ERROR cargando el producto => ${err}`)

    }
})

module.exports = router