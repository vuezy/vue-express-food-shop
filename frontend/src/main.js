import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import Card from './components/Card.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'

sync(store, router)

createApp(App)
  .component('Card', Card)
  .use(router)
  .use(store)
  .mount('#app')
