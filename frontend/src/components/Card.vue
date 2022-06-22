<template>
  <div class="card border-info" :style="{ 'opacity': opacity }">
    <img :src="`/${imgSrc}.jpg`" class="card-img-top">
    <h5 class="card-header card-title text-center" v-html="title"></h5>
    <div class="card-body">
      <slot>
        <span class="fw-bold">Quantity: {{ quantity }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: String,
    imgSrc: String,
    quantity: Number,
    opacity: Number
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0 1rem 0.5rem rgba(173, 216, 230, 0.4);
  margin-bottom: 2rem;
}

.card-img-top {
  height: 8rem;
  border-bottom: 1px solid lightgray;
}

.card-header {
  background-color: #90e196;
  font-weight: bold;
}

.card-body {
  background-color: #a8e1acd7;
}
</style>