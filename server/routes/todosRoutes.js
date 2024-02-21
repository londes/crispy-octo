const express = require('express')
const { model } = require('mongoose')
const router = express.Router()
const controller = require('../controllers/TodosController')

router.get('/', controller.getAll)

router.post('/add', controller.add)

router.post('/delete', controller.delete)

router.post('/update', controller.update)

module.exports = router
