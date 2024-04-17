const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false}
})

// before saving or updating a doc, we check if password changed
userSchema.pre('save', async function (next){
    // if password changed, hash it and save
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

// adding a method to our userSchema that leverages bcrypt.compare()
// to check if passwords match
userSchema.methods.comparePassword = async function (checkPw) {
    return bcrypt.compare(checkPw, this.password)
}

module.exports = mongoose.model('user', userSchema)