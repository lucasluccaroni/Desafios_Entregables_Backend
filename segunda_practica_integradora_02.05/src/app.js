const express = require("express")
const expressHandlebars = require("express-handlebars")
const mongoose = require("mongoose")
const passport = require("passport")

const initializeStrategyGitHub = require("./config/passport-github.config")
const initializeStrategyLocal = require("./config/passport-local.config")
const { dbName, mongoUrl } = require("./dbConfig")
const sessionMiddleware = require("./session/mongoStorage")

const app = express()

const ProductManager = require("./dao/dbManagers/productManager")
const CartManager = require("./dao/dbManagers/cartManager")

app.use(sessionMiddleware)


// Las dos estrategias de passport funcionan en simultaneo
initializeStrategyLocal()
initializeStrategyGitHub()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const handlebars = expressHandlebars.create({
    defaultLayout: "main",
    handlebars: require("handlebars"),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
})
app.engine("handlebars", handlebars.engine)
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")


app.use("/api/products", require("./routes/products.router"))
app.use("/api/cart", require("./routes/cart.router"))
app.use("/api/sessions", require("./routes/session.router"))
app.use("/", require("./routes/views.router"))




const main = async () => {

    await mongoose.connect(mongoUrl, { dbName })

    // creacion de nueva instancia prodcuctManager
    const productManager = new ProductManager()
    await productManager.initialize()
    app.set("productManager", productManager)

    // creacion de nueva instancia cartManager
    const cartManager = new CartManager()
    await cartManager.initialize()
    app.set("cartManager", cartManager)

    app.listen(8080, () => {
        console.log("Server OK!")
    })
}

main()