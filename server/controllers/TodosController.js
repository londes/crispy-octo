const ObjectId = require('mongoose').Types.ObjectId
const mongoose = require('mongoose')
const Todos = require('../models/todos')

class TodosController {

    async getAll(req, res) {
        console.log('in our getAll')
        let { userId } = req.user
        try {
            let todos = await Todos.find({ user_id: userId })
            res.send(todos)
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    }

    async add(req, res) {
        try {
            let { todo, completed, editing, index, user_id } = req.body
            let match = await Todos.find({todo: req.body.todo})
            match.length > 0
                ? res.send({ok: true, data: `WARNING: todo ${req.body.todo} already exists, nothing added`})
                : (async function addTodo() {
                    await Todos.create({ todo, index, user_id })
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
        let { updates } = req.body
        let session = null
        try {
            session = await mongoose.startSession();
            session.startTransaction()

            for (let i = 0; i < updates.length; i++) {
                // grab our update object in our array
                let updateObj = updates[i]
                // pull out our _id and create a new obj with the rest of the values
                let {_id, ...updateFields} = updateObj

                let match = await Todos.findOneAndUpdate(
                    {_id: _id},
                    {$set: updateFields },
                    {session, new: true} // set new: true to return the updated document
                )

                if (!match) 
                    console.log(`WARNING: Todo with id ${_id} not found, nothing updated`)
            }
            await session.commitTransaction();
            session.endSession();

            res.send({ok: true, data: `todos updated successfully`})
        } catch (error) {
            if (session) {
                try {
                    await session.abortTransaction()
                } catch (abortError) {
                    console.error('error aborting transaction: ', abortError)
                } finally {
                    console.log('session ended')
                    session.endSession()
                }
            }
            console.error(`error updating todos`, error)
            res.status(500).send({ok: false, error: `failed to update todos`})
        }
    }

}

module.exports = new TodosController()