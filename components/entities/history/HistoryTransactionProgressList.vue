<script setup lang="ts">

</script>

<template>
  <ul :class="$style.HistoryTransactionProgressList">
    <li>
      <HistoryTransactionProgressItem
        label="Initialization swap"
        status="success"
      />
    </li>
    <li>
      <HistoryTransactionProgressItem
        label="Bridge message to TAC chain"
        status="success"
      />
    </li>
    <li>
      <HistoryTransactionProgressItem
        label="Execution swap"
        status="error"
      />
    </li>
    <li>
      <HistoryTransactionProgressItem
        label="Bridge message to TON chain"
      />
    </li>
    <li>
      <HistoryTransactionProgressItem
        label="Settlement"
      />
    </li>
  </ul>
</template>

<style module lang="scss">
.HistoryTransactionProgressList {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
