// DESAFIO ENTREGABLE #4 - HANDLEBARS Y WEBSOCKETS

//importo y configuro express, handlebars y socket.io
const express = require("express")
const app = express()
const {Server} = require("socket.io")
const handlebars = require("express-handlebars")


//configuración de handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

 
//establezco las rutas de routes
const realTimeProducts = require("./routes/realTimeProducts.route")
const viewRouter = require("./routes/home.router")

//configuracion de express permitir envio de info mediante forms y JSON

app.use(express.urlencoded({extended: true}))
app.use(express.json())

//conexion de las url con los routes
app.use("/", viewRouter)
app.use("/realtimeproducts", realTimeProducts)

app.use(express.static(`${__dirname}/../public`))


//puerto
const httpServer = app.listen(1303, ()=>{ console.log("Server ready.")})

const wsServer = new Server(httpServer)
app.set("ws", wsServer)

wsServer.on("connection", (clientSocket) =>{
    console.log("New client connected by WebSocket")
    // agregar logica de websocket => pending
})