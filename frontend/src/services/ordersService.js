import api from './api'

export default {
  countCustomers() {
    return api().get('/customers')
  },
  addCustomer() {
    return api().post('/customers')
  },
  getOrders() {
    return api().get('/orders')
  },
  serveCustomer(orderId) {
    return api().post(`/orders/${orderId}`)
  },
  deleteOrder(orderId) {
    return api().delete(`/orders/${orderId}`)
  }
}