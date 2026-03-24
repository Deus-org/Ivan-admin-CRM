<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div v-if="statsStore.loading" class="loading-container">
      <Spinner />
    </div>

    <div v-else>
      <div class="stats">
        <div class="stat-card" v-for="stat in statsData" :key="stat.label">
          <h3>{{ stat.label }}</h3>
          <p>{{ stat.value }}</p>
        </div>
      </div>

      <div class="charts">
        <div class="chart-card">
          <h3>Orders by Status</h3>
          <canvas ref="statusChart"></canvas>
        </div>
        <div class="chart-card">
          <h3>Revenue Over Time</h3>
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useStatsStore } from '@/stores/stats'
import { useThemeStore } from '@/stores/theme'
import { Chart, registerables } from 'chart.js'
import Spinner from '@/components/common/Spinner.vue'
Chart.register(...registerables)

const statsStore = useStatsStore()
const themeStore = useThemeStore()

const statusChart = ref<HTMLCanvasElement | null>(null)
const revenueChart = ref<HTMLCanvasElement | null>(null)
let statusChartInstance: Chart | null = null
let revenueChartInstance: Chart | null = null

const statsData = computed(() => [
  { label: 'Total Users', value: statsStore.totalUsers() },
  { label: 'Total Orders', value: statsStore.totalOrders() },
  { label: 'Total Revenue', value: `$${statsStore.totalRevenue().toFixed(2)}` }
])

const renderStatusChart = () => {
  if (!statusChart.value) return
  if (statusChartInstance) statusChartInstance.destroy()
  const data = statsStore.ordersByStatus()
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
  statusChartInstance = new Chart(statusChart.value, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Number of Orders',
        data: data.values,
        backgroundColor: primaryColor
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

const renderRevenueChart = () => {
  if (!revenueChart.value) return
  if (revenueChartInstance) revenueChartInstance.destroy()
  const data = statsStore.revenueByDate()
  const dangerColor = getComputedStyle(document.documentElement).getPropertyValue('--danger').trim()
  revenueChartInstance = new Chart(revenueChart.value, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Revenue ($)',
        data: data.values,
        borderColor: dangerColor,
        fill: false,
        tension: 0.1
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

watch(() => statsStore.orders, () => {
  renderStatusChart()
  renderRevenueChart()
}, { deep: true })

watch(() => themeStore.isDark, () => {
  renderStatusChart()
  renderRevenueChart()
})

onMounted(async () => {
  await statsStore.fetchAllData()
  renderStatusChart()
  renderRevenueChart()
})
</script>

<style lang="scss" scoped>
.dashboard {
  h1 {
    margin-bottom: 1.5rem;
  }
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  @include card;
  text-align: center;
  h3 {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }
  p {
    font-size: 2rem;
    font-weight: bold;
    color: var(--primary);
  }
}
.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
}
.chart-card {
  @include card;
  height: 400px;
  h3 {
    margin-bottom: 1rem;
  }
  canvas {
    width: 100%;
    height: calc(100% - 2rem);
  }
}
@media (max-width: 768px) {
  .charts {
    grid-template-columns: 1fr;
    .chart-card {
      height: 300px;
    }
  }
}
</style>
