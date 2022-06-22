<template>
  <div class="inventory">
    <ul class="nav nav-pills">
      <li class="nav-item">
        <router-link
          :class="['nav-link', { 'active': checkPathParam('ingredient') }]"
          :to="{ name: 'inventory', params: { itemType: 'ingredient' } }"
        >Ingredients</router-link>
      </li>
      <li class="nav-item">
        <router-link
          :class="['nav-link', { 'active': checkPathParam('dish') }]"
          :to="{ name: 'inventory', params: { itemType: 'dish' } }"
        >Dishes</router-link>
      </li>
    </ul>
    <div class="row row-cols-4">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="col"
      >
        <Card :title="item.name" :imgSrc="`${item.itemType}/${item.imageName}`" :quantity="item.quantity" />
      </div>
      <p v-if="items.length === 0 && dishes.length === 0" class="text-center fw-bold">
        ~ ~ ~ EMPTY ~ ~ ~
      </p>
    </div>
    <div v-if="checkPathParam('dish') && dishes.length > 0" class="row row-cols-4">
      <hr v-if="items.length > 0">
      <div
        v-for="(dish, i) in dishes"
        :key="i"
        class="col"
      >
        <Card
          :title="dish.recipeId.name"
          :imgSrc="`dish/${dish.recipeId.imageName}`"
          :opacity="dish.opacity"
        >
          <Timestamp
            v-if="dish.timestamp"
            @time-up="destroyTimestamp(dish)"
            :target="`dish ${dish.finishAt}`"
            class="fw-bold"
          />
          <button
            v-else
            class="btn btn-success btn-center"
            @click="claimDish(dish._id, dish.recipeId.name)"
          >CLAIM</button>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import inventoryService from '@/services/inventoryService'
import Timestamp from '@/components/Timestamp.vue'

export default {
  name: 'Inventory',
  data() {
    return {
      items: [],
      dishes: []
    }
  },
  components: {
    Timestamp
  },
  emits: ['re-render'],
  watch: {
    '$route.params.itemType': {
      immediate: true,
      async handler(value) {
        if (value === 'ingredient' || value === 'dish') {
          try {
            this.items = (await inventoryService.showInventory(value)).data.items
            if (value === 'dish') {
              this.dishes = (await inventoryService.showDishes()).data.dishes
              this.dishes.forEach((dish) => {
                dish.timestamp = true
                dish.opacity = 0.7
              })
            }
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
  },
  methods: {
    checkPathParam(itemType) {
      return this.$route.params.itemType === itemType
    },
    destroyTimestamp(dish) {
      dish.timestamp = false
      dish.opacity = 1
      this.$store.dispatch('setAlert', {
        msg: 'Some dishes are ready to be claimed!',
        color: 'info',
        statusCode: 200
      })
    },
    async claimDish(dishId, name) {
      try {
        await inventoryService.claimDish(dishId)
        this.$emit('re-render')
        this.$store.dispatch('setAlert', {
          msg: `${name} claimed successfully!`,
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
  },
  beforeRouteEnter(to, from) {
    const pathParam = to.params.itemType
    if (pathParam !== 'ingredient' && pathParam !== 'dish') {
      return { name: 'inventory', params: { itemType: 'ingredient' } }
    }
  }
}
</script>

<style scoped>
.nav.nav-pills {
  justify-content: center;
  margin-bottom: 3rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.nav-link {
  width: 15rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

.nav-pills .nav-link {
  background-color: rgba(211, 211, 211, 0.5);
  color: rgba(0, 0, 0, 0.7);
}

.nav-pills .nav-link:hover {
  background-color: rgba(223, 193, 45, 0.3);
}

.nav-pills .nav-link.active {
  background-color: rgb(223, 193, 45);
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

.col .timestamp {
  font-size: 1.2rem;
}

.row p {
  font-size: 1.5rem;
  font-family: Poppins;
}

hr {
  border-top: 8px double black;
  width: 92%;
  margin: 0 auto;
  margin-bottom: 2rem;
}

.btn-center {
  display: block;
  margin: 0 auto;
  padding: 0.2rem 2rem;
  letter-spacing: 0.2rem;
  font-family: Poppins;
}
</style>
