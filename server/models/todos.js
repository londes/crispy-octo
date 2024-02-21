const mongoose = require('mongoose')

const todosSchema = new mongoose.Schema({
    todo: {type: String, required: true, unique: true},
    complete: {type: Boolean, required: true},
    todo_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
})

module.exports = mongoose.model('todo', todosSchema)