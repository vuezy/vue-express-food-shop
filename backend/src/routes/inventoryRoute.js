const { showInventory, showDishes, claimDish } = require('../controllers/inventoryController')
const isAuthenticated = require('../policies/isAuthenticated')

module.exports = (router) => {
  router.get(
    '/inventory/:itemType',
    isAuthenticated,
    showInventory
  )
  router.get(
    '/dishes',
    isAuthenticated,
    showDishes
  )
  router.post(
    '/dish/:dishId',
    isAuthenticated,
    claimDish
  )
}