<template>
  <div>
    <PageHeader />
    <Sidebar />
    <Alert v-if="alert" :msg="alert.msg" :color="alert.color" />
    <main v-if="!alert || alert.statusCode <= 400">
      <router-view
        :key="componentKey"
        :decrementNumOfCustomers="decrementNumOfCustomers"
        @re-render="reRender"
      />
    </main>
  </div>
</template>

<script>
import ordersService from '@/services/ordersService'
import PageHeader from '@/components/PageHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import Alert from '@/components/Alert.vue'

export default {
  name: 'App',
  data() {
    return {
      timeout: null,
      timer: null,
      counter: 0,
      numOfCustomers: 0,
      componentKey: 0
    }
  },
  components: {
    PageHeader,
    Sidebar,
    Alert
  },
  computed: {
    alert() {
      return this.$store.state.alert
    }
  },
  watch: {
    '$store.state.alert': {
      immediate: true,
      handler(value) {
        if (value) {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.$store.dispatch('setAlert', null)
          }, 3000)
        }
      }
    },
    '$store.state.isLoggedIn': {
      immediate: true,
      async handler(value) {
        if (value) {
          try {
            this.numOfCustomers = (await ordersService.countCustomers()).data.numOfCustomers
            this.timer = setInterval(async () => {
              if (this.numOfCustomers < 8) {
                this.counter++

                if (this.counter === 15) {
                  await ordersService.addCustomer()
                  this.numOfCustomers++
                  this.counter = 0
                  if (this.$route.name === 'orders') {
                    this.reRender()
                  }
                  this.$store.dispatch('setAlert', {
                    msg: 'A customer enters the FOOD SHOP!',
                    color: 'info',
                    statusCode: 200
                  })
                }
                
              }
            }, 1000)
          }
          catch(err) {
            this.$store.dispatch('setAlert', {
              msg: err.response.data.error,
              color: 'danger',
              statusCode: err.response.status
            })
          }
        }
        else {
          clearInterval(this.timer)
          this.numOfCustomers = 0
          this.counter = 0
        }
      }
    }
  },
  methods: {
    reRender() {
      this.componentKey = !this.componentKey
    },
    decrementNumOfCustomers() {
      this.numOfCustomers--
    }
  },
  unmounted() {
    this.$store.dispatch('setAlert', null)
    clearTimeout(this.timeout)
    clearInterval(this.timer)
  }
}
</script>

<style>
body {
  background-image: linear-gradient(to right, #c4dcc6d7 20%, white);
  background-size: cover;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

main {
  margin-top: 4rem !important;
  margin-left: 20rem !important;
  height: 100%;
  padding-top: 3rem;
  padding-left: 1rem;
}
</style>
