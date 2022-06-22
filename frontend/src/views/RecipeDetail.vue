<template>
  <div class="container">
    <h1>{{ recipe.name }}</h1>
    <img :src="`/dish/${recipe.imageName}.jpg`" class="dish">
    <p class="description">
      {{ recipe.name }} is worth 
      <span class="fw-bold">${{ toDollar(recipe.price) }}</span> and 
      <span class="fw-bold">{{ recipe.point }} points</span><br>
      Total time taken to make {{ recipe.name }}: 
      <span class="fw-bold">{{ toMinutes(recipe.totalTimeTaken) }}</span>
    </p>
    <h2>Ingredients:</h2>
    <div class="row row-cols-4">
      <div
        v-for="(ingredient, i) in ingredients"
        :key="i"
        class="col"
      >
        <Card
          :title="`${quantity(ingredient.imageName)}x<br>${ingredient.name}`"
          :imgSrc="`ingredient/${ingredient.imageName}`"
        >
          <span class="fw-bold">
            <span
              :class="{ 
                'text-success': ingredient.quantity >= quantity(ingredient.imageName),
                'text-danger': ingredient.quantity < quantity(ingredient.imageName)
              }"
            >
              You have: {{ ingredient.quantity }}
            </span>
          </span>
        </Card>
      </div>
    </div>
    <div v-if="recipe.owned">
      <p class="note text-success">
        *You have owned this recipe
      </p>
      <button
        class="btn btn-primary btn-lg"
        data-bs-toggle="modal"
        data-bs-target="#modal-1"
      >Make {{ recipe.name }}</button>
      <Modal
        :id="1"
        :msg="`Are you sure you want to make ${recipe.name}?`"
        @confirmed="useRecipe(toMinutes(recipe.totalTimeTaken))"
      />
    </div>
    <div v-else>
      <p class="note text-danger">
        *You haven't owned this recipe yet
      </p>
      <button
        class="btn btn-success btn-lg"
        data-bs-toggle="modal"
        data-bs-target="#modal-1"
      >BUY (${{ toDollar(recipe.price) }})</button>
      <Modal
        :id="1"
        msg="Are you sure you want to buy this recipe?"
        @confirmed="buyRecipe"
      />
    </div>
  </div>
</template>

<script>
import recipesService from '@/services/recipesService'
import Modal from '@/components/Modal.vue'

export default {
  name: 'RecipeDetail',
  data() {
    return {
      recipe: {},
      ingredients: []
    }
  },
  components: {
    Modal
  },
  emits: ['re-render'],
  methods: {
    toDollar(price) {
      return (price / 100).toFixed(2)
    },
    toMinutes(ms) {
      const mins = Math.floor(ms / 60000)
      ms = ms % 60000
      if (ms === 0) {
        return mins + ' minutes'
      }
      else {
        return mins + ' minutes ' + Math.floor(ms / 1000) + ' seconds'
      }
    },
    quantity(name) {
      return this.recipe.ingredients[name]
    },
    async buyRecipe() {
      try {
        const data = (await recipesService.buyOrUseRecipe(this.$route.params.recipeId)).data
        this.$store.dispatch('setUser', data.user)
        this.$emit('re-render')
        this.$store.dispatch('setAlert', {
          msg: 'You have bought the recipe!',
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
    async useRecipe() {
      try {
        await recipesService.buyOrUseRecipe(this.$route.params.recipeId)
        this.$emit('re-render')
        this.$store.dispatch('setAlert', {
          msg: 'Preparing the dish...',
          color: 'info',
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
      const data = (await recipesService.getRecipeDetail(this.$route.params.recipeId)).data
      if (!data.recipe || !data.ingredients) {
        this.$router.push({ name: 'recipes' })
      }
      else {
        this.recipe = data.recipe
        this.ingredients = data.ingredients
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
</script>

<style scoped>
.container {
  margin-bottom: 2rem;
}

h1 {
  font-weight: bold;
  font-style: italic;
  font-family: 'Times New Roman', serif;
  font-size: 4rem;
  text-align: center;
}

.dish {
  display: block;
  width: 55%;
  height: 22rem;
  margin: 0 auto;
}

.description {
  text-align: center;
  font-size: 1.7rem;
  font-family: 'Comic Sans MS';
}

h2 {
  font-weight: bold;
  font-style: italic;
  font-family: 'Times New Roman', serif;
  font-size: 2.5rem;
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

.note {
  font-style: italic;
  font-size: 1.2rem;
}

.btn-lg {
  display: block;
  margin: 0 auto;
  padding: 0.2rem 2rem;
  letter-spacing: 0.2rem;
  font-family: Poppins;
  font-size: 2rem;
}
</style>