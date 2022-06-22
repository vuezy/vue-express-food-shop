<template>
  <div class="container">
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <router-link
          :class="['nav-link', { 'active': checkCurrentRoute('home') }]"
          :to="{ name: 'home' }"
        >Home</router-link>
      </li>
      <li class="nav-item" v-if="isLoggedIn">
        <router-link
          :class="['nav-link', { 'active': checkCurrentRoute('shop') }]"
          :to="{ name: 'shop' }"
        >Shop</router-link>
      </li>
      <li class="nav-item" v-if="isLoggedIn">
        <router-link
          :class="['nav-link', { 'active': checkCurrentRoute('inventory') }]"
          :to="{ name: 'inventory', params: { itemType: 'ingredient' } }"
        >Inventory</router-link>
      </li>
      <li class="nav-item" v-if="isLoggedIn">
        <router-link
          :class="['nav-link', { 'active': checkCurrentRoute(['recipes', 'recipe']) }]"
          :to="{ name: 'recipes' }"
        >Recipes</router-link>
      </li>
      <li class="nav-item" v-if="isLoggedIn">
        <router-link
          :class="['nav-link', { 'active': checkCurrentRoute('orders') }]"
          :to="{ name: 'orders' }"
        >Orders</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn
    }
  },
  methods: {
    checkCurrentRoute(routeName) {
      if (Array.isArray(routeName)) {
        for (let i = 0; i < routeName.length; i++) {
          if (this.$route.name === routeName[i]) {
            return true
          }
        }
        return false
      }
      return this.$route.name === routeName
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0;
  padding-top: 2rem;
  width: 20rem;
  height: 100vh;
  background-color: #3f9643d7;
  font-size: 1.8rem;
  font-family: Poppins;
  font-weight: bold;
  letter-spacing: 0.2rem;
  position: fixed;
  top: 4rem;
  left: 0;
  z-index: 1;
}

.nav-item {
  margin-bottom: 0.8rem;
}

.nav-link, .nav-link:focus, .nav-link:hover {
  color: white;
}

.nav-link:hover {
  background-color: #53905677;
}

.nav-pills .nav-link.active {
  background-color: #539056;
}
</style>