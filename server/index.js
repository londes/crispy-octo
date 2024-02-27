const express = require('express')
const app = express()
const port = process.env.PORT || 4040

const mongoose = require('mongoose')
const todosRoutes = require('./routes/todosRoutes')

mongoose.set('debug', true)

app.use(express.urlencoded({extended:true}))
app.use(express.json())

async function connecting() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/todo')
        console.log(`connected to the todos db yee`)
    }
    catch (error) {
        console.log(`ERROR: could not connect to db. please ensure it's running`)
    }
}

app.use('/todos', todosRoutes)

connecting().then(() => {
    app.listen(port, () => console.log(`server running on port ${port}`))
})

// let DB=[]

// app.post('/todos/add', (req, res) => {
//     DB.some(todo => todo.todo == req.body.todo)
//         ? res.send({ok: true, data: `no add: to-do ${req.body.todo} already exists in to-dos`})
//         : (function addSend() {
//             DB.push(req.body)
//             res.send({ok: true, data: `to-do ${req.body.todo} added to to-dos`})
//         })()
// })

// app.post('/todos/update', (req, res) => {
//     let todoLoc = DB.findIndex(todo => todo.todo == req.body.todo)
//     todoLoc > -1 
//         ? (function updateSend() {
//             for (update in DB[todoLoc])
//                 DB[update] = req.body[update]
//             res.send({ok: true, data: `todo ${req.body.todo} successfully updated`})
//         })()
//         : res.send({ok: true, data: `no update: todo ${req.body.todo} not found in to-dos`})
// })

// app.post('/todos/remove', (req, res) => {
//     let removedArr = DB.filter(todo => todo.todo !== req.body.todo)
//     DB.length == removedArr.length
//         ? res.send({ok: true, data: `no delete: to-do ${req.body.todo} not found in to-dos`})
//         : (function removeSend(){
//             DB = removedArr
//             res.send({ok: true, data: `to-do ${req.body.todo} successfully removed`})
//         })()
// })

// app.get('/todos', (req, res) => {
//     res.send({ok: true, data: DB})
// })

// app.listen(port, () => {
//     console.log(`todo server running on port ${port}`)
// })