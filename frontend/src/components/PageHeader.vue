<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <ul class="navbar-nav me-auto mb-lg-0">
        <li class="nav-item">
          <router-link class="nav-link active" :to="{ name: 'home' }">
            <img src="../assets/icon-restaurant-0.png" class="icon">
            FOOD SHOP
          </router-link>
        </li>
      </ul>
      <ul class="navbar-nav mb-lg-0" v-if="!isLoggedIn">
        <li class="nav-item">
          <router-link custom :to="{ name: 'login' }" v-slot="{ navigate }">
            <button class="btn btn-lg btn-hover text-white" @click="navigate">
              Log In
            </button>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link custom :to="{ name: 'register' }" v-slot="{ navigate }">
            <button class="btn btn-lg btn-hover text-white" @click="navigate">
              Sign Up
            </button>
          </router-link>
        </li>
      </ul>
      <ul class="navbar-nav mb-lg-0" v-if="isLoggedIn">
        <li class="nav-item">
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-lg btn-hover btn-success dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >{{ username }}</button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" @click.prevent="logout">Log Out</a></li>
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <button type="button" class="btn btn-lg btn-dark fw-bold" disabled>
            Money: ${{ toDollar(money) }}
          </button>
        </li>
        <li class="nav-item">
          <button type="button" class="btn btn-lg btn-light fw-bold" disabled>
            Score: {{ score }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'PageHeader',
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn
    },
    username() {
      if (this.isLoggedIn) {
        return this.$store.state.user.username
      }
      return ''
    },
    money() {
      if (this.isLoggedIn) {
        return this.$store.state.user.money
      }
      return 0
    },
    score() {
      if (this.isLoggedIn) {
        return this.$store.state.user.score
      }
      return 0
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('setUser', null)
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setAlert', null)
      this.$router.push({ name: 'home' })
    },
    toDollar(money) {
      return (money / 100).toFixed(2)
    }
  }
}
</script>

<style scoped>
nav {
  background-color: #388E3C;
  box-shadow: 0 0.3rem 1rem 0.5rem #3f9643d7;
  font-size: 1.2rem;
  padding: 0.25rem 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 4rem;
}

.nav-link {
  font-size: 1.8rem;
  font-weight: bold;
  padding-bottom: 0;
  padding-left: 5rem !important;
}

.icon {
  width: 40px;
  padding-bottom: 0.5rem;
}

.navbar-nav:not(:first-of-type) {
  text-align: right;
  border-bottom: none;
  margin-right: 1rem;
}

.nav-item {
  margin: 0 auto;
  margin-left: 0.8rem;
}

.btn {
  border-radius: 10px;
  background-color: #539056;
}

.btn-hover:hover {
  background-color: #376c39;
}

.dropdown-menu {
  background-color: #cfe6d1d7;
}

.dropdown-item {
  cursor: pointer;
}
</style>