//DESAFIO ENTREGABLE BACKEND 29/02/2024 - SERVIDOR CON EXPRESS - ALUMNO: LUCAS LUCCARONI


const { ProductManager } = require("./productManager")
const express = require("express")
const app = express()
const fileName = `${__dirname}/../assets/products.json`
const productsManager = new ProductManager(fileName)




//Todos los productos - Query "?limit"
app.get("/products", async (req, res)=>{
    try{
        const products = await productsManager.readProductsFromFile()

        //req.query de "?limit"-
        const {limit} = req.query
        //console.log(limit)

        if(limit){
            const result = products.slice(0,limit)
            res.json({result})
            return
        }

        // devuelve listdo todos los productos
        res.json({products})
        return
    }
    catch(err){
        res.json({error: "Error showing all products."})
    }
})


//Productos por ID
app.get("/products/:pid", async (req, res)=>{
    try{
        // recibe por req.params el pId
        const idProduct = +req.params.pid
        const productToSend = await productsManager.getProductById(idProduct)

        if(!productToSend){
            res.send({error: `ERROR. No user found. ID: ${idProduct}`})
            return
        }

        res.json(productToSend)
        return
    }
    catch(err){
        res.send({error: "ERROR searching for products by ID."})
    }
})


//Prueba
app.get("/test", (_, res)=>{
    res.end("Hola. Testeando.")
})



//El servidor inicia, empieza a escuchar el puerto y las peticiones una vez que se haya completado con exito el método "initialize()" del productsManager.
const main = async () =>{
    try{
        await productsManager.initialize()
    
        //Escuchador de puerto
        app.listen(8080, ()=>{
            console.log("Server ready. Listening to requests.")
        })
    }
    catch(err){
        console.log("Failure initializing app!")
        console.error(err)
    }
}
main()























//El servidor inicia, empieza a escuchar el puerto y las peticiones una vez que se haya completado con exito el método "initialize()" del productsManager.
// productsManager.initialize()
//     .then(()=>{
//         console.log("Initialized Products Manager.")

//         //Escuchador de puerto
//         app.listen(2024, ()=>{
//             console.log("Server ready. Listening to requests.")
//         })
//     })

//     .catch(err =>{
//         console.log("ERROR starting app.")
//         console.error(err)
//     })