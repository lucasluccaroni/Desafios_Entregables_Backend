const { Router } = require("express")
const router = Router()
const User = require("../models/user.model")
const { userIsLoggedIn, userIsNotLoggedIn, } = require("../middlewares/auth.middleware")


// HOME
router.get("/", (req, res) => {
    console.log("Info de session en Home:" , req.session.user)
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render("index", {
        title: "Home",
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn
    })
})

// LOGIN
router.get("/login", userIsNotLoggedIn, (req, res) => {

    res.render("login", {
        Title: "Login"
    })
})

// REGISTER
router.get("/register", userIsNotLoggedIn,  (req, res) => {

    res.render("register", {
        title: "Register"
    })
})

// PROFILE
router.get("/profile", userIsLoggedIn, async (req, res) => {

    console.log("Info de session en Profile: ", req.session.user)
    const idFromSession = req.session.user._id

    // Si tiene _id: 1 (porque es admin), importo los datos de admin y los renderizo.
    if(idFromSession == 1){
        const user = req.session.user
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

    // Si el _id != 1 , busco en la DB el user, traigo sus datos y los renderizo.
    } else {
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
    }
})


module.exports = router