const ObjectId = require('mongoose').Types.ObjectId
const mongoose = require('mongoose')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET

class UserController {

    async getAll(req, res) {
        try {
            const users = await User.find({})
            res.send(users)
        } catch (e) {
            console.log('error getting all users: ', e)
            res.send(e)
        }
    }

    async register(req, res) {
        try {
            // destructuring our request object
            let { username, email, password } = req.body
            // check for all fields
            if (!username || !email || !password)
                return res.status(400).send({ message: "all fields are required" })
            else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(username))
                return res.status(400).send({message: 'username must contain only letters and numbers'})
            else if (!/^\S+@\S+\.\S+$/.test(email))
                return res.status(400).send({message: 'please enter a valid email'})
            else {
                let existing = await User.findOne({$or: [{username: username}, {email: email}]})
                // Schema.find() returns an array, so check if there are any matches
                if (existing)
                    return res.status(400).send({message: 'username or email already exists'})
                else {
                    // create an instance of our User schema object with provided data
                    const user = new User({ username, email, password })
                    // save user to db
                    user.save()
                    const token = jwt.sign({ userId: user._id}, jwt_secret)
                    return res.status(201).send({ token: token, message: 'success, user added. redirecting to todos' })
                }
            }
        } catch (e) {
            console.log('error registering user: ', e)
            res.send(e)
        }
    }

    async login(req, res) {
        try {
            // destructure request body
            let { username, email, password } = req.body
            // build a query object to search by either username or pw
            let query = {}
            if (email)
                query.email = email
            else if (username)
                query.username = username
            else
                return res.status(400).send('a username or email is required')
            // find the user by username or email
            let user = await User.findOne(query)
            // if our user is not found by username/pw, or if password does not match
            if (!user || !(await user.comparePassword(password)))
                return res.status(401).send('authentication failed, bad username/email or password')
            const token = jwt.sign({ userId: user._id }, jwt_secret)
            res.send({ token })
        } catch (e) {
            res.send(e)
        }
    }

    async delete(req, res) {
        try {
            let { username } = req.body
            if (!username)
                res.status(400).send({ok: false, message: `username is required`})
            let user = await User.findOneAndDelete({ username: username })
            console.log(user)
            user 
                ? res.status(200).send({ok: true, message: `user ${username} removed`})
                : res.status(404).send({ok: true, message: `user ${username} not found, nothing removed`})
        } catch(e) {
            console.error(e)
            res.status(500).send({ok: false, message: 'internal server error during delete'})
        }
    }

    async update(req, res) {
        // should consider implementing JWT tokens and further security here as updating is a sensitive operation
        try {
            // grab id from our request
            let { _id } = req.body
            // if there's no _id, we can't update
            if ( !_id )
                return res.status(400).send({ ok: false, message: `no id found for user update, cannot update`})
            // create a new object with all of our updates, and remove _id which we don't want here
            let updateObj = {...req.body}
            delete updateObj._id
            // locate user by ID and update according to new information provided. note that options param {new: true syntax} ensures that an updated username is always returned in our ternary statement if
            let user = await User.findOneAndUpdate({ _id: _id }, { $set: updateObj }, { new: true })
            user 
                ? res.status(200).send({ok: true, message: `user ${user.username} updated`})
                : res.status(404).send({ok: true, message: `user not found, nothing updated`})
        } catch(e) {
            console.log(e)
            res.status(500).send({ok: false, message: 'internal server error during update'})
        }
    }
}

module.exports = new UserController()