const { Router } = require("express")
const router = Router()
const User = require("../models/user.model")
const { userIsLoggedIn, userIsNotLoggedIn, userIsAdmin, admin } = require("../middlewares/auth.middleware")



router.get("/", (req, res) => {
    console.log("Info de session en Home:" , req.session.user)
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render("index", {
        title: "Home",
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn
    })
})


router.get("/login", userIsNotLoggedIn, (req, res) => {
    // To Do: Agregar midelware, solo se puede acceder si no está logueado - HECHO
    res.render("login", {
        Title: "Login"
    })
})


router.get("/register", userIsNotLoggedIn, (req, res) => {
    // To Do: Agregar midelware, solo se puede acceder si no está logueado - HECHO

    res.render("register", {
        title: "Register"
    })
})


router.get("/profile", userIsLoggedIn, userIsAdmin, async (req, res) => {
    // To Do: Agregar middleware, solo se puede acceder si esta logueado - HECHO
    // To Do: Mostrar los datos del usuario logeado, en vez de los fake - HECHO
    const idFromSession = req.session.user._id
    // const { admin } = 

    const user = await User.findOne(( {_id: idFromSession} ))

    res.render("profile", {
        title: "My Profile",
        user:{
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email,
            rol: user.rol
        }
    })
})


module.exports = router