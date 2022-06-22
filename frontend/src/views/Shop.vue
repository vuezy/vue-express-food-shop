<template>
  <div class="shop">
    <h1>Buy what you want~</h1>
    <h1>~Buy what you need</h1>
    
    <Search />

    <div class="row row-cols-4">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="col"
      >
        <Card :title="item.name" :imgSrc="`ingredient/${item.imageName}`">
          <ul class="list-group list-group-flush text-center fw-bold">
            <li class="list-group-item">
              Price:<br>
              ${{ toDollar(item.price * item.quantity) }}
            </li>
            <li class="list-group-item">
              Quantity: {{ item.quantity }}
              <br>
              <button
                class="btn btn-sm btn-secondary"
                @click="decrementQty(item)"
              >-</button>
              <button
                class="btn btn-sm btn-secondary"
                @click="incrementQty(item)"
              >+</button>
            </li>
            <li class="list-group-item">
              <button 
                class="btn btn-success"
                data-bs-toggle="modal"
                :data-bs-target="`#modal-${i}`"
              >BUY</button>
            </li>
          </ul>
        </Card>
        <Modal
          :id="i"
          :msg="`Are you sure you want to buy ${item.quantity}x ${item.name}?`"
          @confirmed="buyIngredient(item)"
        />
      </div>
    </div>

    <p v-if="items.length === 0">
      Your search did not match any ingredients!
    </p>

  </div>
</template>

<script>
import shopService from '@/services/shopService'
import Search from '@/components/Search.vue'
import Modal from '@/components/Modal.vue'

export default {
  name: 'Shop',
  data() {
    return {
      items: []
    }
  },
  components: {
    Search,
    Modal
  },
  watch: {
    '$route.query.name': {
      immediate: true,
      async handler(value) {
        try {
          this.items = (await shopService.getIngredients(value)).data.items
          this.items.forEach((item) => {
            item.quantity = 1
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
    }
  },
  methods: {
    toDollar(price) {
      return (price / 100).toFixed(2)
    },
    decrementQty(item) {
      item.quantity = Math.max(1, item.quantity - 1)
    },
    incrementQty(item) {
      item.quantity = Math.min(20, item.quantity + 1)
    },
    async buyIngredient(item) {
      try {
        const user = (await shopService.buyIngredient(item)).data.user
        this.$store.dispatch('setUser', user)
        this.$store.dispatch('setAlert', {
          msg: `You have bought ${item.quantity}x ${item.name}!`,
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
    }
  }
}
</script>

<style scoped>
h1 {
  font-family: Poppins;
  font-style: italic;
}

h1:first-of-type {
  padding-left: 5rem;
}

h1:last-of-type {
  padding-left: 10rem;
  margin-bottom: 3rem;
}

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

li .btn-sm {
  margin: 0.2rem;
  padding: 0 0.5rem;
  font-size: 1rem;
}

p {
  text-align: center;
  font-family: Poppins;
  font-style: italic;
  font-size: 1.5rem;
}
</style>
