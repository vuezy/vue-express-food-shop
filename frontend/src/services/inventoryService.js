import api from './api'

export default {
  showInventory(itemType) {
    return api().get(`/inventory/${itemType}`)
  },
  showDishes() {
    return api().get('/dishes')
  },
  claimDish(dishId) {
    return api().post(`/dish/${dishId}`)
  }
}