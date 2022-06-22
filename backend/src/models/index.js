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

/*
French Toast
2 egg
1 milk
1 cinnamon
2 bread
1 butter

Soegogi-Jeon
1 meat
1 black pepper
3 egg
1 oil
1 flour

Onigiri
1 rice
1 nori
1 oil

Bak Pao
2 flour
1 meat
1 oil

Yakisoba
1 noodle
3 cabbage
2 carrot
3 green onion
1 black pepper
1 oil
1 meat
1 sauce

Fried Rice
1 rice
2 egg
3 cabbage
2 carrot
3 green onion
1 oil
1 butter

Pizza
3 flour
2 meat
2 black pepper
1 oil
1 sauce
*/