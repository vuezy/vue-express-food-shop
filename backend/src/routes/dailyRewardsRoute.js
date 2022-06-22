const { getMsecs, claimRewards } = require('../controllers/dailyRewardsController')
const isAuthenticated = require('../policies/isAuthenticated')

module.exports = (router) => {
  router.use('/rewards', isAuthenticated)
  router
    .route('/rewards')
    .get(getMsecs)
    .post(claimRewards)
}