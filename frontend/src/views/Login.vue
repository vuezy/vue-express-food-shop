<template>
  <div class="container">
    <h1>Log In</h1>

    <div class="form-floating mb-3">
      <input
        type="email"
        v-model="email"
        :class="['form-control', { 'is-invalid': isInvalid }]"
        id="floatingInput"
        placeholder="Email address"
      >
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating mb-3">
      <input
        type="password"
        v-model="password"
        :class="['form-control', { 'is-invalid': isInvalid }]"
        id="floatingPassword"
        placeholder="Password"
      >
      <label for="floatingPassword">Password</label>
    </div>

    <p>
      Don't have an account? 
      <router-link :to="{ name: 'register' }">Create your account</router-link>
    </p>
    <p class="text-danger">{{ error }}</p>
    <button class="btn btn-primary" @click.prevent="login">Log In</button>
  </div>
</template>

<script>
import authenticationService from '@/services/authenticationService'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  computed: {
    isInvalid() {
      return !!this.error
    }
  },
  methods: {
    async login() {
      try {
        const res = await authenticationService.login({
          email: this.email,
          password: this.password
        })
        this.$store.dispatch('setUser', res.data.user)
        this.$store.dispatch('setToken', res.data.token)
        this.$router.push({ name: 'home' })
      }
      catch(err) {
        this.error = err.response.data.error
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 52%;
  box-shadow: 0 0 2rem 0.8rem rgba(0, 0, 0, 0.434);
  font-family: Poppins;
  padding: 1.5rem 1rem;
  margin-top: 3rem;
  border-radius: 10px;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.btn {
  padding-left: 1.7rem;
  padding-right: 1.7rem;
}
</style>