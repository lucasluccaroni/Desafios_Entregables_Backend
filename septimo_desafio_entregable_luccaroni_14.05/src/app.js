const express = require("express")
const config = require("./config/index")
console.log("CONFIG (app.js) => ", config)

const app = express()

const routes = [
    require("./routes/test.router"),
    require("./routes/views.router")
]

app.use(express.urlencoded({extended: true}))
app.use(express.json())


for (const route of routes) {
    route.configure(app)
}

app.listen(config.PORT, () => {
    console.log("Desafio entregable")
})