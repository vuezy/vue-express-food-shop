<template>
  <div class="timestamp">
    {{ timestamp }}
  </div>
</template>

<script>
import dailyRewardsService from '@/services/dailyRewardsService'

export default {
  name: 'Timestamp',
  data() {
    return {
      timer: null,
      secs: 0
    }
  },
  props: {
    target: String
  },
  emits: ['time-up', 'one-minute-left'],
  computed: {
    timestamp() {
      let result = ''
      let secs = this.secs

      const hours = Math.floor(secs / 3600)
      if (hours / 10 < 1) {
        result += '0'
      }
      result += hours + ':'
      secs = secs % 3600

      const mins = Math.floor(secs / 60)
      if (mins / 10 < 1) {
        result += '0'
      }
      result += mins + ':'
      secs = secs % 60

      if (secs / 10 < 1) {
        result += '0'
      }
      result += secs

      return result
    }
  },
  async mounted() {
    let msecs = 0
    if (this.target === 'daily rewards') {
      try {
        msecs = (await dailyRewardsService.getMsecs()).data.msecs
      }
      catch(err) {
        this.$store.dispatch('setAlert', {
          msg: err.response.data.error,
          color: 'danger',
          statusCode: err.response.status
        })
      }
    }
    else if (this.target.slice(0, 4) === 'dish') {
      msecs = Number(this.target.slice(5))
    }
    else if (this.target.slice(0, 5) === 'order') {
      msecs = Number(this.target.slice(6))
    }

    let doneEmitting = false
    this.secs = Math.floor(msecs / 1000)
    this.timer = setInterval(() => {
      if (this.secs > 0) {
        this.secs -= 1
        if (this.secs < 60 && !doneEmitting) {
          doneEmitting = true
          this.$emit('one-minute-left')
        }
      }
      else {
        clearInterval(this.timer)
        this.$emit('time-up')
      }
    }, 1000)
  },
  unmounted() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.timestamp {
  font-family: Poppins;
  color: #2c3e50;
  text-align: center;
  background-color: #85b2df67;
  box-shadow: 0 0.2rem 0.5rem 0.1rem #2c3e50;
  border-radius: 20px;
}
</style>