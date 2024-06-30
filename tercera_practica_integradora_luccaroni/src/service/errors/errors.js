module.exports = {

    // DATABASE
    databaseProblem(){
        return "An unexpected error caused failure in opreation. Please try again later and verify your inputs."
    },

    // PRODUCTS
    generateInvalidProductIdError(id){
        return ` Invalid product data. ID: Should be an MongoObjectId. Recived: ${id} (${typeof id})`
    },

    generateInvalidProductDataError(){
        return ` Some product data sent is incorrect or missing. Please check it before re-sending.` 
    },

    // CARTS
    generateInvalidCartIdError(id){
        return ` Invalid cart data. ID: Should be an MongoObjectId. Recived: ${id} (${typeof id})`
    },

    generateInvalidCartDataError(){
        return ` Some cart data sent is incorrect or missing. Please check it before re-sending.` 
    },

    generateWrongCartError(cartId) {
        return `Cart ${cartId} does not belong to this user!. Select your cart please.`
    },

    generateWrongQuantityError(quantity){
        return `Recieved ${quantity} quantity. It must be less than product's stock.`
    },

    // USERS
    generateInvalidCredentialsError(email, password){
        return ` Some user data sent is incorrect or missing. Please check it before re-sending. Recieved: ${email} and ${password}` 
    },

    generateInvalidUserEmailError(email){
        return ` Invalid user data. ID: Should be an MongoObjectId. Recived: ${email} (${typeof email})`
    },

    generateInvalidUserIdError(id){
        return ` Invalid user data. ID: Should be an MongoObjectId. Recived: ${id} (${typeof id})`
    }
}