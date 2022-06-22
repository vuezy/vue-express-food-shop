import api from './api'

export default {
  getRecipes(name) {
    if (name) {
      return api().get('/recipes', {
        params: {
          name: name
        }
      })
    }
    return api().get('/recipes')
  },
  getRecipeDetail(recipeId) {
    return api().get(`/recipe/${recipeId}`)
  },
  buyOrUseRecipe(recipeId) {
    return api().post(`/recipe/${recipeId}`)
  }
}