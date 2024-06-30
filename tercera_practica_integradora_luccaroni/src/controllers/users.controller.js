const { logger } = require("../logger/logger")

class UsersController {
    constructor(service) {
        this.service = service
    }

    async resetPassword(req, res) {
        try {
            const { email, password } = req.body

            const resetPassword = this.service.resetPassword(email, password)

            return resetPassword
        }
        catch (err) {
            // console.log("CATCH EN CONTROLLER - resetPassword", err)
            res.status(err.code).json(err)
        }
    }

    async getUserById(req, res) {
        try {
            const idFromSession = req.session.user.id
            console.log("ID SESSION CONTROLLER => ", idFromSession)

            if (idFromSession == 1) {
                const user = req.session.user
                res.send(user)

            } else {
                const user = await this.service.getUseById(idFromSession)
                res.send(user)
            }
        }
        catch (err) {
            console.log("CATCH EN CONTROLLER - resetPassword", err)
            res.sendError(err.message)
        }
    }

    async changeRole(req, res) {
        try{
            const userId = req.params.uid
            logger.info("USER ID - USERS CONTROLLER => ", userId)
    
            const changeRole = await this.service.changeRole(userId)
            res.sendSuccess(`User role modified! => ${changeRole} `) 
        }
        catch(err) {
            req.logger.fatal("CATCH EN CONTROLLER - changeRole", err)
            req.logger.error(err.code)
            res.status(err.code).send(err)
        }

    }
}

module.exports = { UsersController }