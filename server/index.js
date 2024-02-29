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