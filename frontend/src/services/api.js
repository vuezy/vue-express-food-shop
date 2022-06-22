import axios from 'axios'
import store from '@/store'

export default () => {
  const options = {
    baseURL: 'http://localhost:8081/'
  }
  if (store.state.token) {
    options.headers = {
      Authorization: 'Bearer ' + store.state.token
    }
  }

  return axios.create(options)
}