<template>
  <div class="container">
    <h1>WELCOME TO</h1>
    <h1>FOOD SHOP</h1>
    <p>
      Use your recipes,<br>
      Get the ingredients, Make the dishes,<br>
      and<br>
      Serve your customers.
    </p>
    <div class="start-playing" v-if="!isLoggedIn">
      <span>Start playing now!!!</span>
      <router-link custom :to="{ name: 'login' }" v-slot="{ navigate }">
        <button class="btn btn-success" @click="navigate">Log In</button>
      </router-link>
      or
      <router-link custom :to="{ name: 'register' }" v-slot="{ navigate }">
        <button class="btn btn-primary" @click="navigate">Sign Up</button>
      </router-link>
    </div>
    <DailyRewards v-if="isLoggedIn" />
  </div>
</template>

<script>
import DailyRewards from '@/components/DailyRewards.vue'

export default {
  name: 'Home',
  components: {
    DailyRewards
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn
    }
  }
}
</script>

<style scoped>
.container {
  text-align: center;
}

h1 {
  font-size: 4rem;
  color: rgba(163, 107, 3, 0.655);
  font-weight: bold;
  font-family: Poppins;
}

p {
  font-size: 1.2rem;
  margin: 1.2rem 0;
}

.start-playing {
  font-size: 1.7rem;
  font-weight: bold;
}

span {
  display: block;
  margin-bottom: 0.5rem;
}

.btn {
  font-size: 1.2rem;
}
</style>