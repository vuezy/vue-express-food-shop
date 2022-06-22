<template>
  <div class="recipes">
    <h1>Collect all recipes~</h1>
    <h1>~Prepare various dishes</h1>
    
    <Search />

    <div class="row row-cols-4">
      <div
        v-for="(recipe, i) in recipes"
        :key="i"
        class="col"
      >
        <Card :title="recipe.name" :imgSrc="`dish/${recipe.imageName}`">
          <router-link
            custom
            :to="{ name: 'recipe', params: { recipeId: recipe._id } }"
            v-slot="{ navigate }"
          >
            <button
              v-if="recipe.owned"
              class="btn btn-primary btn-center"
              @click="navigate"
            >USE</button>
            <button
              v-else
              class="btn btn-success btn-center"
              @click="navigate"
            >BUY</button>
          </router-link>
        </Card>
      </div>
    </div>

    <p v-if="recipes.length === 0">
      Your search did not match any recipes!
    </p>

  </div>
</template>

<script>
import recipesService from '@/services/recipesService'
import Search from '@/components/Search.vue'

export default {
  name: 'Recipes',
  data() {
    return {
      recipes: []
    }
  },
  components: {
    Search
  },
  watch: {
    '$route.query.name': {
      immediate: true,
      async handler(value) {
        try {
          this.recipes = (await recipesService.getRecipes(value)).data.recipes
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

.btn-center {
  display: block;
  margin: 0 auto;
  padding: 0.2rem 2rem;
  letter-spacing: 0.2rem;
  font-family: Poppins;
}

p {
  text-align: center;
  font-family: Poppins;
  font-style: italic;
  font-size: 1.5rem;
}
</style>
