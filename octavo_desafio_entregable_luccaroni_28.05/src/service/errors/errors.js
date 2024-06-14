module.exports = {

    generateInvalidProductDataError({id}){
        return ` Invalid product data
        * id: Should be an MongoObjectId. Recived: ${id} (${typeof id})
        `
    }
}