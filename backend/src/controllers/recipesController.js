const Promise = require('bluebird')
const { User, Inventory, Ingredient, Recipe, Dish } = require('../models')
const { updateMoney, checkInventory, updateInventory, setRecipeOwned } = require('../utils')

module.exports = {
  async getRecipes(req, res) {
    try {
      const userId = req.user._id
      const name = req.query.name || ''
      
      const recipes = await Recipe.find({
        name: {
          $regex: '.*' + name + '.*',
          $options: 'i'
        }
      }, {
        name: 1,
        imageName: 1,
        price: 1
      }).lean()

      await setRecipeOwned(userId, recipes)

      res.status(200).json({
        success: true,
        recipes: recipes
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async getRecipeDetail(req, res) {
    try {
      const userId = req.user._id
      const { recipeId } = req.params
      const recipe = await Recipe.findById(recipeId).lean()
      if (!recipe) {
        return res.status(200).json({
          success: false
        })
      }
      await setRecipeOwned(userId, [recipe])

      const ingredients = Object.keys(recipe.ingredients)
      const { items } = await Inventory.findOne({
        userId: userId
      }, {
        items: 1,
        _id: 0
      }).lean()

      const allIngredients = (await Promise.all(ingredients.map((name) => {
        return Ingredient.findOne({
          imageName: name 
        }, {
          name: 1,
          imageName: 1,
          _id: 0
        }).lean()
      }))).map((ingredient) => {
        const requiredItem = items.find(item => item.name === ingredient.name)
        if (requiredItem) {
          ingredient.quantity = requiredItem.quantity
        }
        else {
          ingredient.quantity = 0
        }
        return ingredient
      })
      
      res.status(200).json({
        success: true,
        recipe: recipe,
        ingredients: allIngredients
      })
    }
    catch(err) {
      console.log(err)
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async buyOrUseRecipe(req, res) {
    try {
      const userId = req.user._id
      const { recipeId } = req.params
      const recipe = await Recipe.findById(recipeId, {
        price: 1,
        totalTimeTaken: 1,
        ingredients: 1
      }).lean()
      if (!recipe) {
        return res.status(400).json({
          success: false,
          error: 'BAD REQUEST!'
        })
      }
      await setRecipeOwned(userId, [recipe])
      

      if(recipe.owned) {
        const ingredients = Object.keys(recipe.ingredients)
        const inventories = await Promise.all(ingredients.map((name) => {
          return checkInventory(userId, name, 'imageName', recipe.ingredients[name])
        }))
        const hasAllIngredients = inventories.every(value => !!value)

        if (!hasAllIngredients) {
          return res.status(400).json({
            success: false,
            error: 'You do not have enough ingredients!'
          })
        }

        await Promise.all(inventories.map((inventory) => {
          return updateInventory(
            userId, 
            { name: inventory.items[0].name }, 
            inventory, 
            (-1) * recipe.ingredients[inventory.items[0].imageName]
          )
        }))

        const dish = {
          userId: userId,
          recipeId: recipeId,
          finishAt: Date.now() + recipe.totalTimeTaken
        }
        await Dish.create(dish)
        res.status(200).json({
          success: true,
          dish: dish
        })
      }


      else {
        const user = await User.findOne({
          _id: userId
        }, {
          username: 1,
          money: 1,
          score: 1,
          _id: 0
        }).lean()

        if (user.money < recipe.price) {
          res.status(400).json({
            success: false,
            error: 'You do not have enough money!'
          })
        }
        else {
          await updateMoney(userId, user.money - recipe.price)
          await User.updateOne({
            userId: userId
          }, {
            $push: { recipeId: recipe._id }
          }).lean()

          res.status(200).json({
            success: true,
            user: {
              _id: userId,
              username: user.username,
              money: user.money - recipe.price,
              score: user.score
            }
          })
        }
      }
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  }
}