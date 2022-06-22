const { User, Ingredient } = require('../models')
const { checkInventory, updateInventory } = require('../utils')

module.exports = {
  async getMsecs(req, res) {
    try {
      const userId = req.user._id
      const { dailyRewards } = await User.findOne({
        _id: userId
      }, {
        dailyRewards: 1,
        _id: 0
      }).lean()

      const msecs = Math.max(0, dailyRewards - Date.now())
      res.status(200).json({
        success: true,
        msecs: msecs
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async claimRewards(req, res) {
    try {
      const userId = req.user._id
      const { dailyRewards } = await User.findOne({
        _id: userId
      }, {
        dailyRewards: 1,
        _id: 0
      }).lean()

      const msecs = Math.max(0, dailyRewards - Date.now())
      if (msecs === 0) {
        await User.updateOne({
          _id: userId
        }, {
          dailyRewards: Date.now() + 86400000
        }).lean()

        const rewards = []
        const count = await Ingredient.countDocuments().lean()
        for (let i = 0; i < 3; i++) {
          const randNum = Math.floor(Math.random() * count)
          const reward = await Ingredient.findOne({}, {
            name: 1,
            imageName: 1,
            _id: 0
          }).skip(randNum).lean()
          reward.itemType = 'ingredient'
          reward.quantity = 1
          rewards.push(reward)

          const inventory = await checkInventory(userId, reward.name)
          await updateInventory(userId, reward, inventory, reward.quantity)
        }

        res.status(200).json({
          success: true,
          rewards: rewards
        })
      }
      else {
        res.status(400).json({
          success: false,
          error: 'You cannot claim the rewards yet!'
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