const { getRecipes, buyOrUseRecipe, getRecipeDetail } = require('../controllers/recipesController')
const isAuthenticated = require('../policies/isAuthenticated')

module.exports = (router) => {
  router.get('/recipes', isAuthenticated, getRecipes)
  
  router.use('/recipe/:recipeId', isAuthenticated)
  router
    .route('/recipe/:recipeId')
    .get(getRecipeDetail)
    .post(buyOrUseRecipe)
}