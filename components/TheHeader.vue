<script setup lang="ts">

</script>

<template>
  <header class="header">
    <div class="wrap">
      <h1 class="logo">
        <a href="https://curve.fi" target="_blank">
          <img src="/logo.webp" alt="Curve">
        </a>
      </h1>

      <div class="right c-secondary-text p3">
        Powered by

        <div class="logo-tac">
          <img src="/logo-tac.webp" alt="TAC">
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  @include respond-to(mobile) {
    padding: 0 var(--container-padding-side);
  }
}

.logo {
  width: 114px;
  height: 36px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-tac {
  width: 58px;
  height: 18px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
