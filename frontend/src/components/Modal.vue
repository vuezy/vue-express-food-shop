<template>
  <div class="modal fade" :id="`modal-${id}`" tabindex="-1" :aria-labelledby="`modalLabel-${id}`" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="`modalLabel-${id}`">Confirmation</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">{{ msg }}</div>
        <div class="modal-footer">
          <button 
            type="button"
            class="btn btn-success"
            data-bs-dismiss="modal"
            @click="$emit('confirmed')"
          >Yes</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    id: Number,
    msg: String
  },
  emits: ['confirmed']
}
</script>