const mongoose = require('mongoose')

const todosSchema = new mongoose.Schema({
    todo: {type: String, required: true, unique: true},
    completed: {type: Boolean, required: false, default: false},
    editing: {type: Boolean, required: false, default: false},
    index: {type: Number, required: false}
})

module.exports = mongoose.model('todo', todosSchema)