const configObject = require('../config')
const { User, Inventory, Recipe, Order } = require('../models')

module.exports = {
  async updateMoney(userId, money) {
    await User.updateOne({
      _id: userId
    }, {
      money: money
    }).lean()
  },

  async updateScore(userId, score) {
    await User.updateOne({
      _id: userId
    }, {
      score: score
    }).lean()
  },

  async checkInventory(userId, itemName, property='name', quantity=1) {
    const inventory = await Inventory.findOne({
      userId: userId,
      [`items.${property}`]: itemName,
    }, {
      'items.$': 1,
      _id: 0
    }).lean()

    if (inventory && inventory.items[0].quantity >= quantity) {
      return inventory
    }
    return null
  },

  async updateInventory(userId, item, inventory, quantity) {
    if (inventory) {
      await Inventory.updateOne({
        userId: userId,
        'items.name': item.name
      }, {
        $set: {
          'items.$.quantity': inventory.items[0].quantity + quantity
        }
      }).lean()

      await Inventory.updateOne({
        userId: userId
      }, {
        $pull: {
          items: { name: item.name , quantity: 0 }
        }
      }).lean()
    }
    else {
      await Inventory.updateOne({
        userId: userId
      }, {
        $push: { items: item }
      }).lean()
    }
  },

  async setRecipeOwned(userId, recipes) {
    const { recipeId } = await User.findOne({
      _id: userId
    }, {
      recipeId: 1,
      _id: 0
    })

    recipes.map((recipe) => {
      if (recipeId.includes(recipe._id)) {
        recipe.owned = true
      }
      else {
        recipe.owned = false
      }
      return recipe
    })
  },

  async deleteCustomer(userId, orderId) {
    await Order.deleteOne({
      userId: userId,
      _id: orderId
    }).lean()
  }
}
