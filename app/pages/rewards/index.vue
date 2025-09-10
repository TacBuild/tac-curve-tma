<script setup lang="ts">
defineOptions({
  name: 'RewardsPage',
})

const { isConnected, isLoaded, getTonConnectUI } = useTonConnect()
const { rewards, isRewardsLoading } = useMerkl()
</script>

<template>
  <div>
    <div class="gap-8 flex-between flex-center mb-8">
      <h2 class="h1 weight-600">
        Rewards via Merkl
      </h2>

      <UiButton
        size="smaller"
        href="https://t.me/MerklAppBot"
        target="_blank"
        style="flex-shrink: 0"
      >
        <div
          class="flex-center gap-8"
        >
          Open app
          <UiIcon
            class="icon--16"
            name="link"
          />
        </div>
      </UiButton>
    </div>
    <p class="p2 mb-16">
      Rewards distributed via Merkl, with updates every 8-12 hours.
    </p>

    <div
      v-if="isRewardsLoading"
      class="ui-loader center"
    />
    <div v-else-if="!isConnected && isLoaded">
      <UiButton
        wide
        size="small"
        @click="getTonConnectUI().modal.open()"
      >
        Connect wallet
      </UiButton>
    </div>
    <div v-else>
      <div v-if="!rewards.length && isConnected">
        You do not have any rewards to claim yet
      </div>
      <ul class="column gap-8">
        <li
          v-for="reward in rewards"
          :key="reward.root"
        >
          <RewardCard :reward="reward" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
