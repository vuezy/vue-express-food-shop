const { User, Ingredient } = require('../models')
const { updateMoney, checkInventory, updateInventory } = require('../utils')

module.exports = {
  async getIngredients(req, res) {
    try {
      const name = req.query.name || ''
      const ingredients = await Ingredient.find({
        name: {
          $regex: '.*' + name + '.*',
          $options: 'i'
        }
      }).lean()
      res.status(200).json({
        success: true,
        items: ingredients
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async buyIngredient(req, res) {
    try {
      const userId = req.user._id
      const item = req.body

      const user = await User.findOne({
        _id: userId
      }, {
        username: 1,
        money: 1,
        score: 1,
        _id: 0
      }).lean()

      const { imageName, price } = await Ingredient.findOne({
        name: item.name
      }, {
        imageName: 1,
        price: 1,
        _id: 0
      }).lean()

      if (user.money < price * item.quantity) {
        res.status(400).json({
          success: false,
          error: 'You do not have enough money!'
        })
      }
      else {
        await updateMoney(userId, user.money - price * item.quantity)
        item.imageName = imageName
        item.itemType = 'ingredient'
        const inventory = await checkInventory(userId, item.name)
        await updateInventory(userId, item, inventory, item.quantity)

        res.status(200).json({
          success: true,
          user: {
            _id: userId,
            username: user.username,
            money: user.money - price * item.quantity,
            score: user.score
          }
        })
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