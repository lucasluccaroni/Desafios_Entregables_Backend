const { Router } = require("express")
const passport = require("passport")
const { userIsAdmin, userIsLoggedIn } = require("../middlewares/auth.middleware")
const User = require("../dao/models/user.model")

const { UsersDAO } = require("../dao/mongo/users.dao")
const dao = new UsersDAO()

const { SessionsService } = require("../service/sessions-service")
const service = new SessionsService(dao)

const { SessionsController } = require("../controllers/sessions.controller")
const controller = new SessionsController(service)




module.exports = () => {

    const router = Router()


    router.get("/current", userIsLoggedIn, async (req, res) => {
        console.log("Info de session en Current: ", req.session.user)
        const idFromSession = req.session.user.id
        console.log("ID SESSION => ", idFromSession)
    
    
        // Si tiene _id: 1 (porque es admin), importo los datos de admin y los renderizo.
        if(idFromSession == 1){
            const user = req.session.user
            res.send(user)
    
        // Si el _id != 1 , busco en la DB el user, traigo sus datos y los renderizo.
        } else {
            controller.getUserById(req, res)
        }
    })

    // REGISTER FORM
    router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {

        console.log("usuario! ", req.user)

        res.redirect("/")
    })

    // REGISTER FAIL
    router.get("/failregister", (_, res) => {
        res.send("Error registering user!")
    })

    // LOGIN FORM
    router.post("/login", userIsAdmin, passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
        console.log("INFO PARA LOGIN => ", req.body)

        req.session.user = { email: req.user.email, id: req.user.id }
        res.redirect("/")
    })

    // LOGIN FAIL
    router.get("/faillogin", (_, res) => {
        res.render("faillogin")
    })

    // LOGIN CON GITHUB
    router.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => { })

    router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/api/sessions/fallogin" }), async (req, res) => {
        req.session.user = { email: req.user.email, id: req.user.id }
        res.redirect("/profile")
    })


    // LOGOUT
    router.get("/logout", (req, res) => {
        req.session.destroy(_ => {
            res.redirect("/")
        })
    })

    // RESET PASSWORD
    router.post("/reset_password", async (req, res) => {
        const resetPassword = await controller.resetPassword(req, res)
        console.log(resetPassword)

        res.redirect("/")
    })
    return router
}

