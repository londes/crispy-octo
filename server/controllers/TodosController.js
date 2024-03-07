const ObjectId = require('mongoose').Types.ObjectId
// we want to import our model once we start using mongoose, but let's just move our server code here
const Todos = require('../models/todos')

class TodosController {

    async getAll(req, res) {
        try {
            console.log('in our TODOS GET ALL yayay')
            let todos = await Todos.find({})
            res.send(todos)
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    }

    async add(req, res) {
        try {
            let match = await Todos.find({todo: req.body.todo})
            console.log(match)
            match.length > 0
                ? res.send({ok: true, data: `WARNING: todo ${req.body.todo} already exists, nothing added`})
                : (async function addTodo() {
                    await Todos.create({todo: req.body.todo})
                    res.send({ok: true, data: `todo ${req.body.todo} successfully added`})
                })()
        } catch (e) {
            res.send(e)
        }
    }

    async delete(req, res) {
        try {
            let match = await Todos.find({todo: req.body.todo})
            console.log(match)
            if (match.length > 0) {
                await Todos.deleteOne({todo: req.body.todo})
                res.send({ok: true, data: `todo ${req.body.todo} successfully deleted`})
            } else {
                res.send({ok: true, data: `WARNING: todo ${req.body.todo} not found, nothing deleted`})
            }
        } catch(e) {
            res.send(e)
        }
    }

    async update(req, res) {
        let {todo, completed} = req.body
        try {
            let match = await Todos.findOne({todo: todo})
            console.log(match)
            !!match
                ? (async function updateTodo(){
                    await Todos.updateOne({todo: todo}, {completed: completed})
                    res.send({ok: true, data: `todo ${todo} successfully updated`})
                })()
                : res.send({ok: true, data: `WARNING: todo ${req.body.todo} not found, nothing updated`})
        } catch(e) {
            res.send(e)
        }
    }
}

module.exports = new TodosController()