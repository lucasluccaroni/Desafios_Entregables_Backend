const { Router } = require("express")

const router = Router()


router.get("/", (req, res) => {
    res.send("Views")
})


module.exports = {
    configure: app => app.use("/api/views", router)
}