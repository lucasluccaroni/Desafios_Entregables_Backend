const { Router } = require("express")

module.exports = () => {

    const router = Router()

    router.get("/", (req, res) => {
        // console.log("Info de session en HOME => ", req.session.user)

        res.render("index", {
            title: "Home"
        })
    })

    router.get("/register", (req, res) => {
        res.render("register", {
            title: "Register"
        })
    })


    return router
}