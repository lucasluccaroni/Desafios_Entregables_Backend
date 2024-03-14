//importo router
const { Router } = require("express")
const router = Router()



router.get("/", (_, res)=>{
    res.send({status: "test", message: "test Real Time Products"})
})

module.exports = router