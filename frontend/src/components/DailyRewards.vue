<template>
  <div class="daily-rewards">
    <h1>CLAIM YOUR DAILY REWARDS!!!</h1>
    <h1>
      <Timestamp
        @time-up="enableButton"
        target="daily rewards"
      />
    </h1>
    <div class="rewards row row-cols-3">
      <div
        class="reward col"
        v-for="(reward, i) in rewards"
        :key="i"
      >
        <div v-if="reward === '?'" class="is-closed">{{ reward }}</div>
        <Card
          v-else
          :title="reward.name"
          :imgSrc="`${reward.itemType}/${reward.imageName}`"
          :quantity="reward.quantity"
        />
      </div>
    </div>
    <button
      :class="['btn', 'btn-lg', 'btn-warning', { 'disabled': isDisabled }]"
      @click="claimRewards"
    >CLAIM</button>
  </div>
</template>

<script>
import dailyRewardsService from '@/services/dailyRewardsService'
import Timestamp from './Timestamp.vue'

export default {
  name: 'DailyRewards',
  data() {
    return {
      rewards: ['?', '?', '?'],
      isDisabled: true
    }
  },
  components: {
    Timestamp
  },
  methods: {
    async claimRewards() {
      try {
        this.rewards = (await dailyRewardsService.claimRewards()).data.rewards
        this.$store.dispatch('setAlert', {
          msg: 'Rewards claimed successfully!',
          color: 'success',
          statusCode: 200
        })
        this.isDisabled = true
      }
      catch(err) {
        this.$store.dispatch('setAlert', {
          msg: err.response.data.error,
          color: 'danger',
          statusCode: err.response.status
        })
      }
    },
    enableButton() {
      this.isDisabled = false
    }
  }
}
</script>

<style scoped>
.daily-rewards {
  margin-top: 5rem;
}

.daily-rewards h1 {
  font-size: 2.4rem;
  color: rgba(163, 107, 3, 0.655);
  font-weight: bold;
  font-family: Poppins;
}

.daily-rewards .timestamp {
  width: 25%;
  margin: 1rem auto;
}

.daily-rewards .btn {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.3rem;
  padding-right: 4rem;
  padding-left: 4rem;
  margin-bottom: 2rem;
  border-radius: 20px;
}

.rewards {
  justify-content: center;
  align-items: center;
}

.reward {
  width: 20%;
  margin: 0 0.5rem;
  text-align: left;
}

.is-closed {
  margin-bottom: 2rem;
  border: 1px solid black;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  font-size: 10rem;
  font-family: Poppins;
  height: 14rem;
  line-height: 14rem;
  text-align: center;
}
</style>
