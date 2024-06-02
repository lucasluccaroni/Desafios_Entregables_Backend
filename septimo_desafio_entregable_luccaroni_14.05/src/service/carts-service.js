// Service - Repository
const ProductModel = require("../dao/models/product.model")
const CartModel = require("../dao/models/cart.model")

const { ProductsDAO } = require("../dao/mongo/products.dao")
const { ProductsService} = require("./products-service")
const productsDAO = new ProductsDAO()
const productsService = new ProductsService(productsDAO)

class CartsService {
    constructor(dao) {
        this.dao = dao
    }

    async getCarts() {
        const carts = await this.dao.getCarts()
        if (!carts) {
            throw new Error("Someting went wrong!")
        }
        return carts
    }

    async getCartById(id) {
        const cart = await this.dao.getCartById(id)
        console.log("RESPUESTA getCartById DAO => ", cart)

        if (cart === false) {
            throw new Error("Not found!")

        } else if (cart === null) {
            throw new Error("Invalid caracters")
        }

        return cart
    }

    async createCart() {
        const result = await this.dao.createCart()

        if (!result) {
            throw new Error("Someting went wrong!")
        }

        return result
    }

    async addProductToExistingCart(cartId, productId, quantity) {
        try {
            let productExistInCart

            // Busco el carrito
            const cart = await CartModel.findOne({ _id: cartId })
            if (!cart) {
                throw new Error("Cart not found!")
            }
            console.log("CARRITO ENCONTRADO => ", cart)

            // Busco el producto
            const productToAdd = await ProductModel.findById(productId)
            if (!productToAdd) {
                throw new Error("Product not found!")
            }
            console.log("PRODUCTO ENCONTRADO => ", productToAdd)

            // Busco si el producto ya existe en el carrito
            let found = cart.products.find(productToAdd => {
                return (productToAdd._id.toString() === productId)
            })
            console.log("BUSQUEDA SERVICE => ", found)

            // Si no existe, lo agrego al carrito
            if (!found) {
                productExistInCart = false
                const cartUpdate = this.dao.addProductToExistingCart(productExistInCart, cartId, productId, quantity)
                return cartUpdate

                // Si existe, sumo la cantidad ingresada + la que que tenia y actualizo el producto    
            } else if (found) {
                console.log("FOUND ENCONTRADO => ", found)

                quantity += found.quantity
                productExistInCart = true

                const cartUpdate = this.dao.addProductToExistingCart(productExistInCart, cartId, productId, quantity)
                return cartUpdate
            }
        }
        catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    async updateProductFromExistingCart(cartId, productId, quantity) {

        // Busco el carrito
        const cart = await this.getCartById(cartId)

        // Busco el producto
        const productToAdd = await productsService.getProductById(productId)

        // Verificacion si el producto ya esta en el carrito
        let found = cart.products.find(productToAdd => {
            return (productToAdd._id.toString() === productId)
        })

        // Si está, primero verifico si tiene el stock solicitado antes de actualizar la cantidad.
        if (found) {

            // Verifico la cantidad actual, la que se quiere actualizar y el stock disponible
            if(found.quantity < 0 || quantity < 0 || quantity > productToAdd.stock){
                throw new Error ("Wrong quantity")
            }

            found.quantity = quantity
            
            const cartUpdate = await this.dao.updateProductFromExistingCart(cartId, productId, quantity)
            return cartUpdate
        
        // Si no está, arrojo un error
        } else if (!found) {
            throw new Error("Product is not in cart!")
        }
    }

    async clearCart(id) {

        const cart = await CartModel.findOne({ _id: id })
        if (!cart) {
            throw new Error('Cart not found!')
        }

        const result = await this.dao.clearCart(id)
        console.log("RESULT SERVICE => ", result)
        if (!result) {
            throw new Error("Something went wrong!")
        }

        return result
    }

    async deleteCart(id) {

        const deletedCart = await this.dao.deleteCart(id)

        if (!deletedCart) {
            throw new Error("Something went wrong!")

        } else if (deletedCart.deletedCount == 0) {
            console.log("DELETED PRODUCT SERVICE", deletedCart.deletedCount)
            throw new Error("Product not found!")
        }

        console.log("DELETED PRODUCT SERVICE", deletedCart.deletedCount)
        return (deletedCart)

    }

}

module.exports = { CartsService }