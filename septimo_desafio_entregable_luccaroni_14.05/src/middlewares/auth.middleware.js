module.exports = {
    userIsLoggedIn: (req, res, next) => {
        // el usuario debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if(!isLoggedIn) {
            return res.status(401).json({error: "User should be logged in!"})
        }
        next()
    },

    userIsNotLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)

        if(isLoggedIn) {
            return res.status(401).json({error: "User should not be logged in!"})
        }
        next()
    },


    userIsAdmin: (req, res, next) =>{

        const adminData = {
            firstName: "admin",
            lastName: "admin",
            age: 100,
            email: "admin@admin.com",
            password: "admin",
            rol: "admin",
            id: 1
        }
        // Si es admin, lo autentifica y redirige a profile
        if(req.body.email === adminData.email && req.body.password === adminData.password ) {
            req.session.user = adminData
            console.log("Bienvenido ADMIN")
            return res.redirect("/profile")
            }

        // Si no es admin, continua con la autenticación normal
        next()
    },    
}

