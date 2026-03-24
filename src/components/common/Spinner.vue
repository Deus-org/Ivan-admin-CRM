<template>
  <div class="spinner">
    <div class="spinner-circle"></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.spinner {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.spinner-circle {
  width: 24px;
  height: 24px;
  border: 2px solid $primary;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
