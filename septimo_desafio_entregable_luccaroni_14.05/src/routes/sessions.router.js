const { Router } = require("express")
const passport = require("passport")

module.exports = () => { 

    const router = Router()


    router.get("/current", async (req, res) => {
        console.log("Info de session CURRENT => ", req.session.user)
    })


    // REGISTER FORM
    router.post("/register", passport.authenticate("register", {failureRedirect: "/api/sessions/failregister"}), async (req, res) => {
    
        console.log("usuario! ", req.user)
    
        res.redirect("/")
    })

    // REGISTER FAIL
    router.get("/failregister", (_, res) => {
        res.send("Error registering user!")
    })


    // LOGIN FORM
    router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
        console.log("INFO PARA LOGIN => ", req.body)

        req.session.user = {email: req.user.email, id: req.user.id}
        res.redirect("/")
    })

    // LOGIN FAIL
    router.get("/faillogin", (req, res) => {
        res.render("Fail Login!")
    })


    // LOGOUT
    router.get("/logout", (req, res) => {
        req.session.desroy(_ => {
            res.redirect("/")
        })
    })

    return router
}

