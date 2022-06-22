<template>
  <div class="form-outline">
    <input
      type="search"
      class="form-control rounded"
      placeholder="Type to search..."
      aria-label="Search"
      aria-describedby="search-addon"
      v-model="search"
    >
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Search',
  data() {
    return {
      search: ''
    }
  },
  watch: {
    search: _.debounce(function(value) {
      const routeObject = {
        name: this.$route.name
      }
      if (value) {
        routeObject.query = {
          name: value
        }
      }
      this.$router.push(routeObject)
    }, 800),
    '$route.query.name': {
      immediate: true,
      handler(value) {
        this.search = value || ''
      }
    }
  }
}
</script>

<style scoped>
.form-outline {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 2rem;
  box-shadow: 0 0 1rem 1.2rem rgba(173, 216, 230, 0.5);
  border-radius: 20px;
  font-family: monospace;
}
</style>