const express = require("express")
const mongoose = require("mongoose")
const { dbName, mongoUri, port } = require("./config")
const expressHandlebars = require("express-handlebars")
const passport = require("passport")


const { configureCustomResponses } = require("./controllers/utils")
const createProductsRouter = require("./routes/products.router")
const createCartsRouter = require("./routes/carts.router")
const createSessionsRouter = require("./routes/sessions.router")
const createViewsRouter = require("./routes/views.router")
const createMocksRouter = require("./routes/mocks.router")
const createLoggerRouter = require("./routes/loggerTest.router")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(configureCustomResponses)


const initializeStrategyLocal = require("./sessions-config/passport-local.config")
const initializeStrategyGitHub = require("./sessions-config/passport-github.config")
const sessionMiddleware = require("./session/mongoStorage")
const { useLogger } = require("./logger/logger")

app.use(sessionMiddleware)
initializeStrategyLocal()
initializeStrategyGitHub()

app.use(passport.initialize())
app.use(passport.session())



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


app.use(useLogger)

const main = async () => {

    await mongoose.connect(mongoUri, { dbName })

    const routers = [
        { path: "/api/sessions", createRouter: createSessionsRouter },
        { path: "/", createRouter: createViewsRouter },
        { path: "/api/products", createRouter: createProductsRouter },
        { path: "/api/carts", createRouter: createCartsRouter },
        { path: "/mockingproducts", createRouter: createMocksRouter },
        {path: "/loggerTest", createRouter: createLoggerRouter}
    ]

    for (const { path, createRouter } of routers) {
        app.use(path, await createRouter())
    }

    app.listen(port, () => {
        console.log(`CoderServer Ready - port: ${port}`)
    })
}


main()
