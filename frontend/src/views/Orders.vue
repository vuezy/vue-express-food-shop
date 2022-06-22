<template>
  <div class="container">
    <div class="row row-cols-4">
      <div
        v-for="(order, i) in orders"
        :key="i"
        class="col"
      >
        <Card :title="order.recipeId.name" :imgSrc="`dish/${order.recipeId.imageName}`">
          <ul class="list-group list-group-flush text-center fw-bold">
            <li class="list-group-item">
              You'll get:<br>
              <span class="text-success">${{ toDollar(order.recipeId.price) }}</span><br>
              <span class="text-primary">{{ order.recipeId.point }} point(s)</span>
            </li>
            <li class="list-group-item">
              <Timestamp
                @time-up="deleteOrder(order._id)"
                @one-minute-left="alterOrderProperties(order)"
                :target="`order ${order.waitUntil}`"
                class="fw-bold"
              />
            </li>
            <li class="list-group-item">
              <button 
                class="btn btn-success"
                data-bs-toggle="modal"
                :data-bs-target="`#modal-${i}`"
              >SERVE</button>
            </li>
          </ul>
        </Card>
        <Modal
          :id="i"
          msg="Are you sure you want to serve this customer?"
          @confirmed="serveCustomer(order)"
        />
      </div>
    </div>

    <p v-if="orders.length === 0">
      No customers coming to your <span class="fw-bold">FOOD SHOP</span>!
    </p>
  </div>
</template>

<script>
import ordersService from '@/services/ordersService'
import Timestamp from '@/components/Timestamp.vue'
import Modal from '@/components/Modal.vue'

export default {
  name: 'Orders',
  data() {
    return {
      orders: []
    }
  },
  props: {
    decrementNumOfCustomers: Function
  },
  components: {
    Timestamp,
    Modal
  },
  emits: ['re-render'],
  methods: {
    toDollar(money) {
      return (money / 100).toFixed(2)
    },
    alterOrderProperties(order) {
      order.recipeId.price = Math.floor(order.recipeId.price / 2)
      order.recipeId.point = Math.floor(order.recipeId.point / 2)
    },
    async serveCustomer(order) {
      try {
        const user = (await ordersService.serveCustomer(order._id)).data.user
        this.decrementNumOfCustomers()
        this.$emit('re-render')
        this.$store.dispatch('setUser', user)
        this.$store.dispatch('setAlert', {
          msg: `You have earned $${this.toDollar(order.recipeId.price)} and ${order.recipeId.point} point(s)!`,
          color: 'success',
          statusCode: 200
        })
      }
      catch(err) {
        this.$store.dispatch('setAlert', {
          msg: err.response.data.error,
          color: 'danger',
          statusCode: err.response.status
        })
      }
    },
    async deleteOrder(orderId) {
      try {
        await ordersService.deleteOrder(orderId)
        this.decrementNumOfCustomers()
        this.$emit('re-render')
        this.$store.dispatch('setAlert', {
          msg: 'A customer has left the FOOD SHOP!',
          color: 'warning',
          statusCode: 200
        })
      }
      catch(err) {
        this.$store.dispatch('setAlert', {
          msg: err.response.data.error,
          color: 'danger',
          statusCode: err.response.status
        })
      }
    }
  },
  async mounted() {
    try {
      this.orders = (await ordersService.getOrders()).data.orders
    }
    catch(err) {
      this.$store.dispatch('setAlert', {
        msg: err.response.data.error,
        color: 'danger',
        statusCode: err.response.status
      })
    }
  }
}
</script>

<style scoped>
.row {
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
}

.col {
  width: 20%;
  margin: 0 0.6rem;
}

.col .timestamp {
  font-size: 1.2rem;
}

p {
  text-align: center;
  font-family: Poppins;
  font-style: italic;
  font-size: 2rem;
  line-height: 20rem;
  height: 20rem;
}
</style>
