const UserModel = require("../models/user.model")
const { logger } = require("../../logger/logger")

class UsersDAO {

    async getUsers() {
        try {
            const users = await UserModel.find()
            return users.map(u => u.toObject())
        }
        catch (err) {
            logger.error("Error en UsersDAO = getUsers => ", err)
            return null
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.findById(id)
            return user?.toObject() ?? false
        }
        catch (err) {
            logger.error("Error en UsersDAO = getUserById => ", err)
            return null
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email })
            return user?.toObject() ?? false
        }
        catch (err) {
            logger.error("Error en UsersDAO = getUserByEmail => ", err)
            return null
        }
    }

    async resetUserPassword(email, password) {
        try {
            const updatedUser = UserModel.updateOne({ email }, { $set: { password } })

            return updatedUser
        }
        catch (err) {
            logger.error("Error en UsersDAO = updateUser => ", err)
            return null
        }
    }

    async changeRole(id, userRole) {
        try {
            const result = await UserModel.findByIdAndUpdate({ _id: id }, { $set: { role: userRole } })

        }
        catch (err) {
            logger.error(`Error en ProductsDAO - changeRole => ${err}`)
            return null
        }
    }

    async uploadDocuments(userId, originalname, path) {
        try{
            const documents =
            {
                docName: originalname,
                docReference: path
            }
            const uploadDocuments = await UserModel.updateOne({ _id: userId }, { $set: documents })
            console.log(uploadDocuments)

            return uploadDocuments
        }
        catch(err) {
            logger.error("Error en UsersDAO - uploadDocuments => ", err)
            return null
        }
        
    }
}

module.exports = { UsersDAO }