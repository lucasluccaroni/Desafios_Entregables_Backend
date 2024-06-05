const bcrypt = require("bcrypt")

module.exports = {
    hashPasword: value => bcrypt.hashSync(value, bcrypt.genSaltSync(10)),
    isValidPassword: (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword)
}