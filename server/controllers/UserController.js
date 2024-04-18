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
            // create an instance of our User schema object with provided data
            const user = new User({ username, email, password })
            // save user to db
            user.save()
            const token = jwt.sign({ userId: user._id}, jwt_secret)
            res.status(201).send({ token })
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

        console.log('in our delete')
        try {
            res.send({ok: true, data: `delete`})
        } catch(e) {
            res.send(e)
        }
    }

    async update(req, res) {
        console.log('in our update')
        try {
            res.send({ok: true, data: `update`})
        } catch(e) {
            res.send(e)
        }
    }
}

module.exports = new UserController()