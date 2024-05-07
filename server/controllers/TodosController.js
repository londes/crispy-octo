const ObjectId = require('mongoose').Types.ObjectId
const mongoose = require('mongoose')
const Todos = require('../models/todos')

class TodosController {

    async getAll(req, res) {
        let { userId } = req.user
        try {
            let todos = await Todos.find({ user_id: userId })
            res.status(200).send(todos)
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    }

    async add(req, res) {
        let { todos } = req.body
        console.log(todos)
        let session = null 
        try {
            session = await mongoose.startSession()
            session.startTransaction()

            for (let i=0; i < todos.length; i++) {
                // grab our new todo from array
                let newTodo = todos[i]
                console.log(newTodo)
                let { todo, index, user_id } = newTodo
                
                let match = await Todos.findOne({ todo, user_id })
                match
                    ? console.log(`WARNING: todo ${todo} already exists, nothing added`)
                    : await Todos.create({ todo, index, user_id })
            }
            
            await session.commitTransaction();
            session.endSession();
            res.send({ ok: true, data: `todos added successfully`})
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
            console.error(`error adding todos`, error)
            res.status(500).send({ok: false, error: `failed to add todos`})
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