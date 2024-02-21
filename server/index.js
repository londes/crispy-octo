const express = require('express')
const app = express()

// default to 4040 unless there is something specified in our process.env file
const port = process.env.PORT || 4040

app.use(express.urlencoded({extended:true}))
app.use(express.json())

// const mongoose = require('mongoose')

// import our routes
// we will do this later, for now we want a basic server

let DB=[]

app.post('/todos/add', (req, res) => {
    DB.some(todo => todo.todo == req.body.todo)
        ? res.send({ok: true, data: `no add: to-do ${req.body.todo} already exists in to-dos`})
        : (function addSend() {
            DB.push(req.body)
            res.send({ok: true, data: `to-do ${req.body.todo} added to to-dos`})
        })()
})

app.post('/todos/update', (req, res) => {
    let todoLoc = DB.findIndex(todo => todo.todo == req.body.todo)
    todoLoc > -1 
        ? (function updateSend() {
            for (update in DB[todoLoc])
                DB[update] = req.body[update]
            res.send({ok: true, data: `todo ${req.body.todo} successfully updated`})
        })()
        : res.send({ok: true, data: `no update: todo ${req.body.todo} not found in to-dos`})
})

app.post('/todos/remove', (req, res) => {
    let removedArr = DB.filter(todo => todo.todo !== req.body.todo)
    DB.length == removedArr.length
        ? res.send({ok: true, data: `no delete: to-do ${req.body.todo} not found in to-dos`})
        : (function removeSend(){
            DB = removedArr
            res.send({ok: true, data: `to-do ${req.body.todo} successfully removed`})
        })()
})

app.get('/todos', (req, res) => {
    res.send({ok: true, data: DB})
})

app.listen(port, () => {
    console.log(`todo server running on port ${port}`)
})