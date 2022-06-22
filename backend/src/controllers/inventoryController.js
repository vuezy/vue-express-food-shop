const { Inventory, Dish } = require('../models')
const { checkInventory, updateInventory } = require('../utils')

module.exports = {
  async showInventory(req, res) {
    try {
      const userId = req.user._id
      const { itemType } = req.params
      const { items } = await Inventory.findOne({
        userId: userId,
      }, {
        items: 1,
        _id: 0
      }).lean()
      
      const filteredItems = items.filter(item => item.itemType === itemType)
      res.status(200).json({
        success: true,
        items: filteredItems
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async showDishes(req, res) {
    try {
      const userId = req.user._id
      const dishes = await Dish.find({
        userId: userId
      }, { recipeId: 1, finishAt: 1 }).populate('recipeId', {
        name: 1,
        imageName: 1
      }).lean()
      
      dishes.forEach((dish) => {
        dish.finishAt = Math.max(0, dish.finishAt - Date.now())
      })
      res.status(200).json({
        success: true,
        dishes: dishes
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async claimDish(req, res) {
    try {
      const userId = req.user._id
      const { dishId } = req.params
      const dish = await Dish.findOne({
        userId: userId,
        _id: dishId
      }, { recipeId: 1, finishAt: 1 }).populate('recipeId', {
        name: 1,
        imageName: 1
      }).lean()

      if (!dish) {
        return res.status(400).json({
          success: false,
          error: 'BAD REQUEST!'
        })
      }
      if (Math.max(0, dish.finishAt - Date.now()) !== 0) {
        return res.status(400).json({
          success: false,
          error: 'You cannot claim the dish yet!'
        })
      }

      const item = {
        name: dish.recipeId.name,
        imageName: dish.recipeId.imageName,
        itemType: 'dish',
        quantity: 1
      }

      const inventory = await checkInventory(userId, item.name)
      await updateInventory(userId, item, inventory, item.quantity)

      await Dish.deleteOne({
        userId: userId,
        _id: dishId
      }).lean()
      
      res.status(200).json({
        success: true,
        dish: item
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  }
}