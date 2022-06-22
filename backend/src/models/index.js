const mongoose = require('mongoose')
const { Schema, model } = mongoose
require('../config')
const models = {}


models['Ingredient'] = require('./Ingredient')(Schema, model)
models['Recipe'] = require('./Recipe')(Schema, model)
models['User'] = require('./User')(Schema, model)
models['Inventory'] = require('./Inventory')(Schema, model)
models['Dish'] = require('./Dish')(Schema, model)
models['Order'] = require('./Order')(Schema, model)


module.exports = models