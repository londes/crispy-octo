const ObjectId = require('mongoose').Types.ObjectId
// we want to import our model once we start using mongoose, but let's just move our server code here
const Todos = require('../models/todos')

class TodosController {

    async getAll(req, res) {
        console.log('get all')
        res.send({ok: true, data: `get all`})
    }

    async add(req, res) {
        console.log('add')
        res.send({ok: true, data: `add smth`})
    }

    async delete(req, res) {
        console.log('delete')
        res.send({ok: true, data: `delete smth`})
    }

    async update(req, res) {
        console.log('update')
        res.send({ok: true, data: `update smth`})
    }
}

module.exports = new TodosController()