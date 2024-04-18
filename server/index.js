const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 4040

require('dotenv').config()

const mongoose = require('mongoose')

const todosRoutes = require('./routes/todosRoutes')
const userRoutes = require('./routes/userRoutes')

mongoose.set('debug', true)

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(require('cors')())

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../client/build')));

async function connecting() {
    try {
        // await mongoose.connect('mongodb://127.0.0.1/todo')
        await mongoose.connect(`mongodb+srv://wilpur-todo:${process.env.MONGO_PW}@todo.wauvl2d.mongodb.net/todo?retryWrites=true&w=majority&appName=Todo`)
        console.log(`connected to the todos db yee`)
    }
    catch (error) {
        console.log(`ERROR: could not connect to db. please ensure it's running`)
        console.log(error)
    }
}

app.use('/todos', todosRoutes)
app.use('/user', userRoutes)

// part of our routes, but this points to our built front-end
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// connect
connecting().then(() => {
    app.listen(port, () => console.log(`server running on port ${port}`))
})