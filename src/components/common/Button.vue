<template>
  <button :class="['btn', `btn-${variant}`, sizeClass]" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium'
  disabled?: boolean
}>()

const sizeClass = (props: any) => props.size === 'small' ? 'btn-small' : ''
</script>

<style lang="scss" scoped>
.btn {
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:hover:not(:disabled) {
    filter: brightness(0.95);
  }
}

.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  &:hover:not(:disabled) {
    background: var(--primary-dark);
    border-color: var(--primary-dark);
  }
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
  &:hover:not(:disabled) {
    background: var(--border-color);
  }
}

.btn-danger {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
  &:hover:not(:disabled) {
    background: #b71c1c;
    border-color: #b71c1c;
  }
}
</style>
