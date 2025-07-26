<template>
    <div style="max-width: 800px; margin: auto;">
    <Bar v-if="datosGrafico.labels.length" :data="datosGrafico" :options="opcionesGrafico" />
    <p v-else>No hay datos disponibles para mostrar.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  egresos: { tipoProducto: string; cantidad: number }[]
}>()

const datosGrafico = computed(() => {
  const resumen: Record<string, number> = {
    piedra: 0,
    placa: 0,
    piso: 0
  }
props.egresos.forEach(item => {
    const tipo = item.tipoProducto.toLowerCase()
    if (resumen[tipo] !== undefined) {
      resumen[tipo] += item.cantidad || 0
    }
  })

  return {
    labels: ['Piedra', 'Placa', 'Piso'],
    datasets: [{
      label: 'Cantidad Egresada',
      data: [resumen.piedra, resumen.placa, resumen.piso],
      backgroundColor: ['#d62828', '#f77f00', '#fcbf49']
    }]
  }
})

const opcionesGrafico = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: {
      display: true,
      text: 'Comparativa de Egresos por Tipo de Producto',
      color: '#353535',
      font: { size: 20 }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: '#0b090a' },
      grid: { color: '#bcbdc2' },
      border: { color: '#0b090a', width: 1 }
    },
    x: {
      ticks: { color: '#0b090a' },
      grid: { color: '#bcbdc2' },
      border: { color: '#0b090a', width: 1 }
    }
  }
}

</script>