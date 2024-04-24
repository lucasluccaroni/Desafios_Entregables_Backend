const passport = require("passport")
const { Strategy } = require("passport-local")
const User = require("../models/user.model")
const hashingUtils = require("../utils/hashing")

const initializeStrategy = () => {

    // REGISTER
    passport.use("register", new Strategy({
        passReqToCallback: true,
        usernameField: "email",

    }, async (req, username, password, done) => {

        const { firstName, lastName, age, email, } = req.body

        try {
            const user = await User.findOne( { email: username } )
            if(user) {
                // error, usuario con es mail ya existe
                // No hubo un error a nivel aplicacion, solo que el email ya esta usado y la ejecucion del register terminaría aca
                return done(null, false) 
            }

            const newUser = {
                firstName,
                lastName,
                age: +age,
                email,
                password: hashingUtils.hashPassword(password)
            }

            const result = await User.create(newUser)
            
            // usuario nuevo creado exitosamente
            return done(null, result)
            
        }
        catch(err) {
            // error inesperado
            done("Error al obtener el usuario ", err)
        }
    }))



    //LOGIN
    passport.use("login", new Strategy({
        usernameField: "email",

    }, async (username, password, done) => {

        try{

            if( !username || !password ) {
                return done(null, false)
            }
        
            // 1. Verificar que el usuario exista en la BD - HECHO
            const user = await User.findOne( { email: username } )
        
            if(!user) {
                return done(null, false)
            }
        
            //2. Validar password
            if(!hashingUtils.isValidPassword(password, user.password)){
                return done(null, false)
            }

            
            // exito, se devuelve el user.
            return done(null, user)

        }
        catch (err) {
            done(err)
        }
    }))



    passport.serializeUser( (user, done) => {
        console.log("serialized!", user)
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done) => {
        console.log("DEserialized!", id)
        const user = await User.findById(id)
        done(null, user)

    })
}

module.exports = initializeStrategy