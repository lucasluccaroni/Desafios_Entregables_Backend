const { hashPassword } = require("../utils/hashing")

const { ErrorCodes } = require("./errors/errorCodes")
const { CustomError } = require("./errors/CustomError")
const errors = require("./errors/errors")

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
                    message: errors.generateInvalidUserIdError(email),
                    code: ErrorCodes.INVALID_TYPES_ERROR
                })
            }

            // Hasheo la contraseña
            const hashedPassword = hashPassword(password)
            // Actuializo la nueva contraseña
            const resetPassword = await this.dao.resetUserPassword(email, hashedPassword)

            return resetPassword
    }

    async getUserById(id) {
        const user = this.dao.getUserById(id)
        return user
    }
}

module.exports = { UsersService }