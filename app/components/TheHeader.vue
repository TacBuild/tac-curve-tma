<script setup lang="ts">

</script>

<template>
  <header :class="$style.header">
    <div :class="$style.wrap">
      <h1
        :class="$style.logo"
        class="weight-700"
      >
        <a
          class="flex-center gap-8"
          href="https://curve.fi"
          target="_blank"
        >
          <img
            src="/logo.png"
            alt="Curve"
          >
          Curve
        </a>
      </h1>

      <WalletButton />
    </div>
  </header>
</template>

<style lang="scss" module>
.header {
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  right: 0;
  left: 0;
  z-index: 101;
  height: var(--header-h);
  transition: background-color var(--trs-default);
}

.wrap {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: var(--container-w);
  background-color: var(--c-body-bg);

  @include respond-to(mobile) {
    padding: var(--container-padding);
  }
}

.logo {
  font-size: 24px;
  width: 114px;
  height: 36px;

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }
}
</style>
