<template>
  <div style="max-width: 800px; margin: auto;">
    <Bar v-if="datosGrafico.labels.length" :data="datosGrafico" :options="opcionesGrafico" />
    <p v-else>No hay datos disponibles para mostrar.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
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
  ingresos: { tipoProducto: string; cantidad: number }[]
  egresos: { tipoProducto: string; cantidad: number }[]
}>()

const datosGrafico = computed(() => {
  const tipos = ['piedra', 'placa', 'piso']
  const resumenIngresos: Record<string, number> = { piedra: 0, placa: 0, piso: 0 }
  const resumenEgresos: Record<string, number> = { piedra: 0, placa: 0, piso: 0 }

  props.ingresos.forEach(item => {
    const tipo = item.tipoProducto.toLowerCase()
    if (tipo in resumenIngresos) resumenIngresos[tipo] += item.cantidad || 0
  })

  props.egresos.forEach(item => {
    const tipo = item.tipoProducto.toLowerCase()
    if (tipo in resumenEgresos) resumenEgresos[tipo] += item.cantidad || 0
  })

  return {
    labels: tipos.map(tipo => tipo.charAt(0).toUpperCase() + tipo.slice(1)),
    datasets: [
      {
        label: 'Ingresos',
        data: tipos.map(t => resumenIngresos[t]),
        backgroundColor: '#52b788'
      },
      {
        label: 'Egresos',
        data: tipos.map(t => resumenEgresos[t]),
        backgroundColor: '#e76f51'
      }
    ]
  }
})

const opcionesGrafico = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: {
      display: true,
      text: 'Ingresos vs Egresos por Tipo de Producto',
      font: { size: 20 },
      color: '#353535'
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
