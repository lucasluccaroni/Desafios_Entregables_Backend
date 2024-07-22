const { hashPassword } = require("../utils/hashing")
const { transport } = require("../utils/nodemailer")

const { ErrorCodes } = require("./errors/errorCodes")
const { CustomError } = require("./errors/CustomError")
const errors = require("./errors/errors")
const { logger } = require("../logger/logger")

const jwt = require("jsonwebtoken")
const { privateKey } = require("../config")
const bcrypt = require("bcrypt")

class UsersService {
    constructor(dao) {
        this.dao = dao
    }

    //// async resetPassword(email, password) {

    ////     // Verifico que se haya ingresado email y password
    ////     if (!email || !password) {
    ////         throw CustomError.createError({
    ////             name: "Invalid Credentials",
    ////             cause: "Missing or Wrong credentials.",
    ////             message: errors.generateInvalidCredentialsError(email, password),
    ////             code: ErrorCodes.INVALID_TYPES_ERROR
    ////         })
    ////     }

    ////     // Busco al usuario
    ////     const user = await this.dao.getUserByEmail(email)
    ////     if (!user) {
    ////         throw CustomError.createError({
    ////             name: "Not Found ",
    ////             cause: "User Not Found in Database",
    ////             message: errors.generateInvalidUserEmailError(email),
    ////             code: ErrorCodes.INVALID_TYPES_ERROR
    ////         })
    ////     }

    //     // Hasheo la contraseña
    ////     const hashedPassword = hashPassword(password)
    //     // Actuializo la nueva contraseña
    ////     const resetPassword = await this.dao.resetUserPassword(email, hashedPassword)

    ////     return resetPassword
    //// }


    async sendResetEmail(email) {

        const token = jwt.sign({ email }, privateKey, { expiresIn: "1h" })
        console.log("TOKEN CREADO EN sendResetEmail => ", token)

        const resetLink = `http://localhost:8080/new-reset-password?token=${token}`

        return await transport.sendMail({
            from: "LucasLucc",
            to: `${email}`,
            subject: "Password recovery service.",
            html: `
                <div>
                    <h2> Genere una nueva conraseña </h2>
                    <p> Haga clic en el siguiente enlace para restablecer su contraseña. </p> 
                    <a href=${resetLink} > Click aqui </a>
                </div>
                `
        })
    }


    async newResetPassword(token, password) {
        try {
            // Verifico el token
            const tokenInfo = jwt.verify(token, privateKey)
            console.log("TOKEN VERIFICATION => ", tokenInfo)

            // Busco al usuario
            const user = await this.dao.getUserByEmail(tokenInfo.email)
            if (!user) {
                throw CustomError.createError({
                    name: "Not Found ",
                    cause: "User Not Found in Database",
                    message: errors.generateInvalidUserEmailError(),
                    code: ErrorCodes.INVALID_TYPES_ERROR
                })
            }

            // Verifico que la nueva contraseña no sea la misma que la previa
            const samePassword = await bcrypt.compare(password, user.password)
            if (samePassword) {
                throw CustomError.createError({
                    name: "Same password ",
                    cause: "Old password and new password are equals.",
                    message: errors.generateSamePasswordError(),
                    code: ErrorCodes.UNAUTHORIZED
                })
            }

            // Si esta todo bien, hasheo la nueva contraseña
            const hashedPassword = hashPassword(password)
            // Actuializo la nueva contraseña
            const resetPassword = await this.dao.resetUserPassword(tokenInfo.email, hashedPassword)

            return resetPassword
        }
        catch (err) {
            logger.error(`ERROR EN USERS SERVICE => ${err.message}`)
            console.log(err)
            return null
        }
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


    async uploadDocuments(file, userId) {

        // Busco al user por su id
        const user = await this.dao.getUserById(userId)
        if (!user) {
            throw CustomError.createError({
                name: "Not Found ",
                cause: "User Not Found in Database",
                message: errors.generateInvalidUserIdError(id),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        // Extraigo el nombre y el path del documento, que seran cargados al User en la DB
        const { destination, path } = file
        console.log(destination, path)

        // Le cargo la imagen al user en la DB
        const uploadDocuments = this.dao.uploadDocuments(userId, destination, path)

        return uploadDocuments
    }
}


module.exports = { UsersService }