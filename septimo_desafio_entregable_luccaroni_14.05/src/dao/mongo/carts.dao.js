const CartModel = require("../models/cart.model")
const ProductModel = require("../models/product.model")

class CartsDAO {

    async prepare() {
        if (CartModel.db.readyState != 1) {
            console.log("Must connect to MongoDB!")
            return null
        }
    }

    async getCarts() {
        try {
            const carts = await CartModel.find()
            return carts.map(c => c.toObject())
        }
        catch (err) {
            console.log("Error en CartsDAO - getCarts => ", err)
            return null
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findOne(id)
            return cart?.toObject ?? false
        }
        catch (err) {
            console.log("Error en CartsDAO - getCartById => ", err)
            return null
        }
    }

    async createCart() {
        try {
            const newCart = await CartModel.create({ products: [] })
            return newCart
        }
        catch (err) {
            console.log("Error en CartsDAO - createCart => ", err)
            return null
        }
    }

    async addProductToExistingCart(cid, product) {
        try {
            const { pid, quantity } = product

            const cart = await CartModel.findOne({ _id: cid })
            console.log("CARRITO ENCONTRADO => ", cart)

            const productToAdd = ProductModel.findOne({ _id: pid })
            console.log("PRODUCTO ENCONTRADO => ", productToAdd)

            //TODO: Actualizar +1 el producto si ya existe en el carrito, sino agregarlo.
        }
        catch (err) {
            console.log("Error en CartsDAO - addProductToExistingCart => ", err)
            return null
        }
    }

    async updateProductFromExistingCart(cid, product) {
        try {
            const { pid, quantity } = product
            console.log(`PRODUCT ID = ${pid} /// CANTIDAD = ${quantity}`)

            const cart = await CartModel.findOne({ _id: cid })
            console.log("CARRITO ENCONTRADO => ", cart)

            const productToUpdate = ProductModel.findOne({ _id: pid })
            console.log("PRODUCTO ENCONTRADO => ", productToUpdate)

            //TODO: Implementar funcion de actualizacion.
        }
        catch (err) {
            console.log("Error en CartsDAO - updateProductFromExistingCart => ", err)
            return null

        }
    }

    async updateArrayInCart(cid, products) {
        try {
            const cart = await CartModel.findOne({ _id: cid })
            console.log("CARRITO ENCONTRADO => ", cart)

            console.log("PRODUCTOS: => ", products)

            //TODO: Implementar funcion de actualizacion.

        }
        catch (err) {
            console.log("Error en CartsDAO - updateArrayInCart => ", err)
            return null
        }
    }

    async deleteProductFromExistingCart(cid, pid) {
        try {
            const cart = await CartModel.findOne({ _id: cid })
            console.log("CARRITO ENCONTRADO => ", cart)

            const product = await ProductModel.findOne({ _id: pid })
            console.log("PRODUCTO ENCONTRADO => ", product)

            //TODO: Implementar funcion de eliminacion.

        }
        catch (err) {
            console.log("Error en CartsDAO - deleteProductFromExistingCart => ", err)
            return null
        }
    }

    async clearCart(cid) {
        try {
            const cart = await CartModel.findOne({ _id: cid })
            console.log("CARRITO ENCONTRADO => ", cart)

            //TODO: Implementar funcion de limpieza
        }
        catch(err) {
            console.log("Error en CartsDAO - clearCart => ", err)
            return null
        }
    }
}