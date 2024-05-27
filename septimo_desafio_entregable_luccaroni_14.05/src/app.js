const express = require("express")

const createProductsRouter = require("./routes/products.router")
const createCartsRouter  = require("./routes/carts.router")
// const createSessionsRouter = require("./routes/sessions.router")
// const createViewsRouter = require("./routes/views.router")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


const main =  async () => {

    const routers = [
        // { path: "api/sessions", createRouter: createSessionsRouter },
        { path: "/api/products", createRouter: createProductsRouter},
        { path: "/api/carts", createRouter: createCartsRouter}
    ]
    
    for( const {path, createRouter} of routers) {
        app.use(path, createRouter())
    }


    const port = process.env.PORT || 8080
    app.listen(port, ()=> {
        console.log(`CoderServer Ready - port: ${port}`)
    })
}

main()
