const { Router } = require("express")
const router = Router()
const User = require("../models/user.model")
const { userIsAdmin } = require("../middlewares/auth.middleware")
const { isValidPassword, hashPassword } = require("../utils/hashing")
const passport = require("passport")



// LOGIN FORM
router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), userIsAdmin,  async (req, res) =>{

    console.log("Informacion de usuario para login: ", req.body)

    //Crear una nueva sesion si el usuario existe
    req.session.user = { email: req.user.email, _id: req.user._id }

    res.redirect("/api/products")
})  


// RUTA FAIL PARA LOGIN
router.get("/faillogin", (req, res) => {
    res.render("faillogin", {
        title: "Fail login"
    })
})


// REGISTER FORM
router.post("/register", passport.authenticate("register", {failureRedirect: "/api/sessions/failregister"}), async (req, res) => {
    
    console.log("usuario! ", req.user)

    res.redirect("/")
})


// RUTA FAIL PARA REGISTER
router.get("/failregister", (req, res) => {
    res.send("Error registering user!")
})


// LOGOUT
router.get("/logout", (req, res) =>{
    req.session.destroy(_ =>{
        res.redirect("/")
    })
})


// RESET PASSWORD
router.post("/reset_password" , async (req, res) =>{
    const { email, password } = req.body

    if( !email || !password ) {
        return res.status(400).json({error: "Invalid credentials"})
    }

    // 1. Verificar que el usuario exista en la BD - HECHO
    const user = await User.findOne( { email })

    if(!user) {
        return res.status(401).json({error: "User not found"})
    }


    // 2. Actualizar la nueva contraseña
    await User.updateOne({email}, { $set: { password: hashPassword(password) } })

    res.redirect("/")
})


module.exports = router