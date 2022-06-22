<template>
  <div class="container">
    <h1>Register Your Account</h1>

    <div class="form-floating mb-3">
      <input
        type="text"
        v-model="username"
        :class="['form-control', { 'is-invalid': isInvalid }]"
        id="floatingInput"
        placeholder="Username"
      >
      <label for="floatingInput">Username</label>
    </div>
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
      Already have an account? Try to <router-link :to="{ name: 'login' }">login</router-link>
    </p>
    <p class="text-danger">{{ error }}</p>
    <button class="btn btn-primary" @click.prevent="register">Register</button>
  </div>
</template>

<script>
import authenticationService from '@/services/authenticationService'

export default {
  name: 'Register',
  data() {
    return {
      username: '',
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
    async register() {
      try {
        await authenticationService.register({
          username: this.username,
          email: this.email,
          password: this.password
        })
        this.$router.push({ name: 'login' })
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