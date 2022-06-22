const express = require('express')

const router = express.Router()
require('./authenticationRoute')(router)
require('./shopRoute')(router)
require('./inventoryRoute')(router)
require('./recipesRoute')(router)
require('./ordersRoute')(router)
require('./dailyRewardsRoute')(router)

module.exports = router