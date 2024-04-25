const passport = require("passport")
const { Strategy } = require("passport-github2")
const User = require("../models/user.model")
const { clientID, clientSecret, callbackURL } = require("./github.private")


const initializeStrategy = () => {


    passport.use("github", new Strategy({
        clientID,
        clientSecret,
        callbackURL
    }, async (accessToken, refreshToken, profile, done) => {

        try {
            console.log("Profile GITHUB => ", profile,  "GITHUB JSON => ", profile._json)

            const user = await User.findOne( {email: profile._json.email } )
            if(user){
                return done(null, user)
            }
            

            // Crear el usuario si no existe
            const fullName = profile._json.name
            const firstName = fullName.substring(0, fullName.lastIndexOf(' '))
            const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1)
            console.log( "FIRSTNAME:", firstName,  "LASTNAME: ", lastName)


            const newUser = {
                firstName,
                lastName,
                age: 30,
                email: profile._json.email,
                password: ""
            }
            const result = await User.create(newUser)
            done(null, result)

        }
        catch (err) {
            done(err)
        }
    }))



    // SERIALIZER
    passport.serializeUser((user, done) => {
        console.log("serialized!", user)
        done(null, user._id)
    })

    // DESERIALIZER
    passport.deserializeUser(async (id, done) => {
        console.log("DEserialized!", id)
        const user = await User.findById(id)
        done(null, user)

    })
}

module.exports = initializeStrategy