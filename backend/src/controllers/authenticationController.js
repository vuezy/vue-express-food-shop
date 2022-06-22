const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const { User, Inventory, Recipe } = require('../models')
const inventories = require('../../seed/inventories.json')

const PRIV_KEY = fs.readFileSync(path.join(__dirname, '../../keys/rsa_priv_key.pem'), 'utf8')

function jwtSign(user) {
  const payload = {
    sub: user._id,
    username: user.username,
    iat: Date.now()
  }
  const token = jwt.sign(payload, PRIV_KEY, {
    algorithm: 'RS256',
    expiresIn: '7d'
  })
  return token
}


module.exports = {
  async register(req, res) {
    try {
      const { username, email } = req.body
      const isFound = await User.findOne({
        $or: [
          { username: username },
          { email: email }
        ]
      }).lean()
      if (isFound) {
        return res.status(400).json({
          success: false,
          error: 'Username or email already in use!'
        })
      }

      const user = req.body
      user.money = 1000
      user.score = 0
      user.dailyRewards = Date.now()
      user.recipeId = []
      const recipes = await Recipe.find({
        $or: [
          { name: 'Bak Pao' },
          { name: 'Onigiri' }
        ]
      }, { _id: 1 }).lean()
      recipes.forEach((recipe) => {
        user.recipeId.push(recipe._id)
      })

      const newUser = await User.create(user)
      inventories[0].userId = newUser._id
      await Inventory.create(inventories[0])

      res.status(200).json({
        success: true,
        user: newUser
      })
    }
    catch(err) {
      res.status(500).json({
        success: false,
        error: 'An error has occured, please try again!'
      })
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({
        email: email
      })

      if (!user) {
        return res.status(403).json({
          success: false,
          error: 'Invalid email or password!'
        })
      }

      const passwordIsValid = await user.comparePassword(password)
      if (!passwordIsValid) {
        return res.status(403).json({
          success: false,
          error: 'Invalid email or password!'
        })
      }

      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          money: user.money,
          score: user.score
        },
        token: jwtSign(user)
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