/*
  Run this file (via `npm run seed`) to insert initial data (some data are required) to the database
  Please run this file before running `npm run devStart`
*/
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose')
const Promise = require('bluebird')
const users = require('./users.json')
const ingredients = require('./ingredients.json')
const recipes = require('./recipes.json')
const inventories = require('./inventories.json')
require('../src/config')


function resetDB() {
  const connection = mongoose.connection
  connection.once('open', async () => {
    try {
      const collections = await connection.db.listCollections().toArray()
      await Promise.all(collections.map((collection) => {
        return connection.db.dropCollection(collection.name)
      }))
      console.log('Successfully dropped all collections')


      const models = require('../src/models')
      console.log('Successfully created all collections')

      await Promise.all(ingredients.map((ingredient) => {
        return models['Ingredient'].create(ingredient)
      }))
      console.log("Successfully inserted documents to 'ingredients' collection")


      const recipesInserted = await Promise.all(recipes.map((recipe) => {
        return models['Recipe'].create(recipe)
      }))
      console.log("Successfully inserted documents to 'recipes' collection")


      const usersInserted = await Promise.all(users.map((user) => {
        user.recipeId = [recipesInserted[0]._id, recipesInserted[1]._id]
        user.dailyRewards = Date.now()
        return models['User'].create(user)
      }))
      console.log("Successfully inserted documents to 'users' collection")


      await Promise.all(inventories.map((inventory) => {
        inventory.userId = usersInserted[0]._id
        return models['Inventory'].create(inventory)
      }))
      console.log("Successfully inserted documents to 'inventories' collection")
    }
    catch(err) {
      console.log(err)
    }
    finally {
      mongoose.disconnect()
    }
  })
}

resetDB()