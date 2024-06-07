class SessionsController {
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
            console.log("CATCH EN CONTROLLER - resetPassword", err)
            res.sendError(err.message)
        }
    }
}

module.exports = { SessionsController }