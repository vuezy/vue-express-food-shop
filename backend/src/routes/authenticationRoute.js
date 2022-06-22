const authenticationController = require('../controllers/authenticationController')
const authenticationControllerPolicy = require('../policies/authenticationControllerPolicy')

module.exports = (router) => {
  router.post(
    '/register',
    authenticationControllerPolicy.register,
    authenticationController.register
  )

  router.post('/login', authenticationController.login)
}