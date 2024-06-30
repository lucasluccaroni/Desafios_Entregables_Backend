const { Router } = require("express")
const { userIsLoggedIn } = require("../middlewares/auth.middleware")

const { UsersDAO } = require("../dao/mongo/users.dao")
const dao = new UsersDAO

const { UsersService } = require("../service/users-service")
const service = new UsersService(dao)

const { UsersController } = require("../controllers/users.controller")
const controller = new UsersController(service)

module.exports = () => {

    const router = Router()

    router.get("/premium/:uid", userIsLoggedIn, async (req, res) => {

        await controller.changeRole(req, res)


        // res.send({ message: `Welcome, ${userId}!` })
    })

    return router
}