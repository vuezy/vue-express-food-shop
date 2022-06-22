import api from './api'

export default {
  getMsecs() {
    return api().get('/rewards')
  },
  claimRewards() {
    return api().post('/rewards')
  }
}