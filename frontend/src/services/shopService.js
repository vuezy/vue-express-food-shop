import api from './api'

export default {
  getIngredients(name) {
    if (name) {
      return api().get('/ingredients', {
        params: {
          name: name
        }
      })
    }
    return api().get('/ingredients')
  },
  buyIngredient(item) {
    return api().post('/ingredients', { 
      name: item.name,
      quantity: item.quantity
    })
  }
}