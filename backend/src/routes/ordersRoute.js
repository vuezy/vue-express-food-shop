const {
  countCustomers,
  addCustomer,
  getOrders,
  serveCustomer,
  deleteOrder
} = require('../controllers/ordersController')
const isAuthenticated = require('../policies/isAuthenticated')

module.exports = (router) => {
  router.use('/customers', isAuthenticated)
  router
    .route('/customers')
    .get(countCustomers)
    .post(addCustomer)

  router.get('/orders', isAuthenticated, getOrders)

  router.use('/orders/:orderId', isAuthenticated)
  router
    .route('/orders/:orderId')
    .post(serveCustomer)
    .delete(deleteOrder)
}