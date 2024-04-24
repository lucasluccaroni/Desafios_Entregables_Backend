const MongoStore = require("connect-mongo")
const session = require("express-session")
const defaultOptions = require("./defaultOptions")
const { dbName, mongoUrl } = require("../dbConfig")

const storage = MongoStore.create({
    dbName,
    mongoUrl,
    ttl: 300
})

module.exports = session({
    store: storage,
    ...defaultOptions
})