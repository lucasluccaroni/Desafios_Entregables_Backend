const chai = require("chai")
const supertest = require("supertest")
const mocha = require("mocha")

const expect = chai.expect
const requester = supertest("http://localhost:8080")


describe("Testing PRODUCTS router", () => {
    
    const mockUser = {
        title: "Product Test",
        description: "Product Test",
        price: 10000,
        thumbnail: "Product Test",
        code: "aaa111",
        stock: 10000,
        status: true,
        category: "Product Test",
        owner: "Product Test"
    }


    it("GET /api/products => trae todos los productos", async () => {

    })
})