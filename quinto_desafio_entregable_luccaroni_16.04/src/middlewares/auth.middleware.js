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

    admin: {
        firstName: "admin",
        lastName: "admin",
        age: 100,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        _id: "1"
    },

    userIsAdmin: (req, res, next) =>{
        const admin = {
            firstName: "admin",
            lastName: "admin",
            age: 100,
            email: "adminCoder@coder.com",
            password: "adminCod3r123",
            _id: 1
        }

        if(req.body.email === admin.email && req.body.password === admin.password ){
            req.session.user = {email: admin.email, _id: admin._id}
            
            res.send("Bienvenido ADMIN")
            return true

        }

        next()
    }
}

