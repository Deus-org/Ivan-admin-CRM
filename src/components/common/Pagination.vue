<template>
  <div class="pagination">
    <button
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      class="page-btn"
    >
      &laquo; Prev
    </button>
    <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
    <button
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
      class="page-btn"
    >
      Next &raquo;
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:page', page)
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.page-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>
