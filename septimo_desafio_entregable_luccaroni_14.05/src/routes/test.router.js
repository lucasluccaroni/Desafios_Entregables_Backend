const { Router } = require("express")

const router = Router()


router.get("/", (req, res) => {
    res.send("Test")
})


module.exports = {
    configure: app => app.use("/api/test", router)
}