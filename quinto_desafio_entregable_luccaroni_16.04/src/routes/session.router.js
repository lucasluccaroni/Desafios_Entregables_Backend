const { Router } = require("express")
const router = Router()
const User = require("../models/user.model")
const { userIsAdmin } = require("../middlewares/auth.middleware")
const { isValidPassword, hashPassword } = require("../utils/hashing")



// LOGIN FORM
router.post("/login", userIsAdmin,  async (req, res) =>{


    console.log("Informacion de usuario para login: ", req.body)


    const {email, password} = req.body


    if( !email || !password ) {
        return res.status(400).json({error: "Invalid credentials"})
    }

    // 1. Verificar que el usuario exista en la BD - HECHO
    const user = await User.findOne( { email } )

    if(!user) {
        return res.status(401).json({error: "User not found"})
    }


    //2. Validar password
    if(!isValidPassword(password, user.password)){
        return res.status(401).json({error: "Invalid passowrd"})
        
    }

    //3. Crear una nueva sesion si el usuario existe - HECHO
    req.session.user = { email, _id: user._id.toString() }

    res.redirect("/api/products")
})  


// REGISTER FORM
router.post("/register", async (req, res) => {

    console.log("Info del nuevo usuario", req.body)
    //To Do: Crear nuevo usuario insertandolo en la collection de users y logueandolo en la pagina - HECHO
    try{
        const { firstName, lastName, age, email, password } = req.body

        const user = await User.create( {
            firstName,
            lastName,
            age: +age,
            email,
            password: hashPassword(password)
        })

        req.session.user = { email, _id: user._id.toString() }
        res.redirect("/")

    }
    catch(err) {
        return res.status(500).json({error: err})
    }
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