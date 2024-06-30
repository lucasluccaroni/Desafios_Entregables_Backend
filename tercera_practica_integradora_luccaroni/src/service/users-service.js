const { hashPassword } = require("../utils/hashing")
const { transport } = require("../utils/nodemailer")

const { ErrorCodes } = require("./errors/errorCodes")
const { CustomError } = require("./errors/CustomError")
const errors = require("./errors/errors")
const { logger } = require("../logger/logger")
const { id_ID } = require("@faker-js/faker")

class UsersService {
    constructor(dao) {
        this.dao = dao
    }

    async resetPassword(email, password) {

        // Verifico que se haya ingresado email y password
        if (!email || !password) {
            throw CustomError.createError({
                name: "Invalid Credentials",
                cause: "Missing or Wrong credentials.",
                message: errors.generateInvalidCredentialsError(email, password),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        // Busco al usuario
        const user = await this.dao.getUserByEmail(email)
        if (!user) {
            throw CustomError.createError({
                name: "Not Found ",
                cause: "User Not Found in Database",
                message: errors.generateInvalidUserEmailError(email),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        // Hasheo la contraseña
        const hashedPassword = hashPassword(password)
        // Actuializo la nueva contraseña
        const resetPassword = await this.dao.resetUserPassword(email, hashedPassword)

        // Mando mail de confirmacion
        try {
            await transport.sendMail({
                from: "LucasLucc",
                to: `${email}`,
                subject: "Restablecimiento de contraseña",
                html: `
                    <div>
                        <h2> Genere una nueva conraseña </h2>
                        <a href="https://google.com">Click aqui</a>
        
                    </div>
                    `
            })

            logger.debug("MAIL ENVIADO!")
        }
        catch (err) {
            logger.error("Error enviando mail para restablecer contraseña! => ", err)
        }

        return resetPassword
    }

    async getUserById(id) {
        const user = this.dao.getUserById(id)
        return user
    }

    async changeRole(id) {

        // Busco al usuario
        const user = await this.getUserById(id)
        if (!user) {
            throw CustomError.createError({
                name: "Not Found ",
                cause: "User Not Found in Database",
                message: errors.generateInvalidUserIdError(id),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        console.log(user)
        // Me fijo que rol tiene
        const userRole = user.role
        logger.debug(`Rol: ${userRole}`)

        // Defino que Rol se va a mandar al DAO para actualizar, de acuerdo a que rol tenga ahora el user
        let newUserRole
        if (userRole === "user") {
            newUserRole = "premium"
        } else if (userRole === "premium") {
            newUserRole = "user"
        }

        // Mando al DAO la actualizacion de Rol
        const changeRole = await this.dao.changeRole(id, newUserRole)

        return `New user role: ${newUserRole}`
    }
}

module.exports = { UsersService }