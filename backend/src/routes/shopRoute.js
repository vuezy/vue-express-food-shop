const { getIngredients, buyIngredient } = require('../controllers/shopController')
const isAuthenticated = require('../policies/isAuthenticated')

module.exports = (router) => {
  router.use('/ingredients', isAuthenticated)
  router
    .route('/ingredients')
    .get(getIngredients)
    .post(buyIngredient)
}