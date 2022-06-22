const { User, Order } = require('../models')
const { deleteCustomer, checkInventory, updateInventory, updateMoney, updateScore } = require('../utils')

module.exports = {
  async countCustomers(req, res) {
    try {
      const userId = req.user._id
      const numOfCustomers = await Order.countDocuments({ userId: userId }).lean()
      res.status(200).json({
        success: true,
        numOfCustomers: numOfCustomers
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async addCustomer(req, res) {
    try {
      const userId = req.user._id
      const numOfCustomers = await Order.countDocuments({ userId: userId }).lean()

      if (numOfCustomers < 8) {
        const { recipeId } = await User.findOne({
          _id: userId
        }, { recipeId: 1, _id: 0 }).populate('recipeId', { totalTimeTaken: 1 }).lean()
        const randNum = Math.floor(Math.random() * recipeId.length)
        
        await Order.create({
          userId: userId,
          recipeId: recipeId[randNum]._id,
          waitUntil: Date.now() + recipeId[randNum].totalTimeTaken + 180000
        })
        res.status(200).json({
          success: true
        })
      }
      else {
        res.status(400).json({
          success: false,
          error: 'BAD REQUEST!'
        })
      }
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async getOrders(req, res) {
    try {
      const userId = req.user._id
      const orders = await Order.find({
        userId: userId
      }, { recipeId: 1, waitUntil: 1 }).populate('recipeId', {
        name: 1,
        imageName: 1,
        price: 1,
        point: 1
      }).lean()
      
      orders.forEach((order) => {
        order.waitUntil = Math.max(0, order.waitUntil - Date.now())
      })
      res.status(200).json({
        success: true,
        orders: orders
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async serveCustomer(req, res) {
    try {
      const userId = req.user._id
      const { orderId } = req.params
      const order = await Order.findOne({
        userId: userId,
        _id: orderId
      }, {
        recipeId: 1,
        waitUntil: 1,
        _id: 0
      }).populate('recipeId', {
        name: 1,
        price: 1,
        point: 1,
        _id: 0
      }).lean()

      if (!order) {
        return res.status(400).json({
          success: false,
          error: 'BAD REQUEST!'
        })
      }

      const inventory = await checkInventory(userId, order.recipeId.name)
      if (!inventory) {
        return res.status(400).json({
          success: false,
          error: `You do not have ${order.recipeId.name}!`
        })
      }
      await updateInventory(userId, { name: order.recipeId.name }, inventory, -1)

      const user = await User.findOne({
        _id: userId
      }, {
        username: 1,
        money: 1,
        score: 1,
        _id: 0
      }).lean()

      let money = user.money + order.recipeId.price
      let score = user.score + order.recipeId.point
      if (order.waitUntil - Date.now() < 60000) {
        money = user.money + Math.floor(order.recipeId.price / 2)
        score = user.score + Math.floor(order.recipeId.point / 2)
      }

      await updateMoney(userId, money)
      await updateScore(userId, score)
      await deleteCustomer(userId, orderId)
      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          money: money,
          score: score
        }
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async deleteOrder(req, res) {
    try {
      const userId = req.user._id
      const { orderId } = req.params
      const order = await Order.findOne({
        userId: userId,
        _id: orderId
      }, {
        waitUntil: 1,
        _id: 0
      }).lean()

      if (!order || Date.now() <= order.waitUntil) {
        return res.status(400).json({
          success: false,
          error: 'BAD REQUEST!'
        })
      }
      await deleteCustomer(userId, orderId)
      res.status(200).json({
        success: true
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