const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const mongoose = require("mongoose")

//INTERCAMBIO DE BASE DE DATOS EN MONGODB / BASE DE DATOS EN ARCHIVO .JSON
const ProductManager = require("./dao/dbManagers/productManager")
//const {ProductManager} = require("./dao/fileManagers/productManager")

const CartManager = require("./dao/fileManagers/cartManager")


app.use(express.json())
app.use(express.urlencoded({extended: true}))


const productsRouter = require("./routes/products.router")
const cartRouter = require("./routes/cart.router")
//enlaze de comunicacion entre los routes y las rutas
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)


const main = async () =>{
    await mongoose.connect("mongodb://localhost:27017/",{
        dbName: "entrega_practica_integradora"
    })

    // ↓↓ Al hacer el cambio de bases de datos, si se usa el archivo JSON, meter el path de archivo dentro del parametro de la creacion de la instanciaa "ProductoManager" ↓↓  `${__dirname}/../assets/products.json`
    const productManager = new ProductManager()
    await productManager.initialize()
    app.set("productManager", productManager)

    const cartManager = new CartManager(`${__dirname}/../assets/carts.json`)
    await cartManager.readCartFromFile()
    app.set("cartManager", cartManager)  
    
    app.listen(1137, ()=> { console.log("Servidor listo")})
}

main()