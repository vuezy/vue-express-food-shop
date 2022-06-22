import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Shop from '../views/Shop.vue'
import Inventory from '../views/Inventory.vue'
import Recipes from '../views/Recipes.vue'
import RecipeDetail from '../views/RecipeDetail.vue'
import Orders from '../views/Orders.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/shop',
    name: 'shop',
    component: Shop
  },
  {
    path: '/inventory/:itemType',
    name: 'inventory',
    component: Inventory
  },
  {
    path: '/inventory',
    redirect: { name: 'inventory', params: { itemType: 'ingredient' } }
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: Recipes
  },
  {
    path: '/recipe/:recipeId',
    name: 'recipe',
    component: RecipeDetail
  },
  {
    path: '/orders',
    name: 'orders',
    component: Orders
  },
  {
    path: '/:pathMatch(.*)',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
