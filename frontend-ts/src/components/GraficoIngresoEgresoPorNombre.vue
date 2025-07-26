<template>
  <div style="max-width: 1000px; margin: auto;">
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
  ingresos: { nombre: string; cantidad: number }[]
  egresos: { nombre: string; cantidad: number }[]
}>()

const datosGrafico = computed(() => {
  const resumenIngresos: Record<string, number> = {}
  const resumenEgresos: Record<string, number> = {}

  props.ingresos.forEach(item => {
    const clave = item.nombre || 'Sin nombre'
    resumenIngresos[clave] = (resumenIngresos[clave] || 0) + (item.cantidad || 0)
  })

  props.egresos.forEach(item => {
    const clave = item.nombre || 'Sin nombre'
    resumenEgresos[clave] = (resumenEgresos[clave] || 0) + (item.cantidad || 0)
  })

  // Tomar los nombres únicos de ambos conjuntos
  const nombresUnicos = Array.from(
    new Set([...Object.keys(resumenIngresos), ...Object.keys(resumenEgresos)])
  )

  // Ordenar por ingresos descendente (podés cambiar a egresos si querés)
  nombresUnicos.sort((a, b) => (resumenIngresos[b] || 0) - (resumenIngresos[a] || 0))

  // Opcional: mostrar solo los 10 primeros productos
  const topNombres = nombresUnicos.slice(0, 10)

  return {
    labels: topNombres,
    datasets: [
      {
        label: 'Ingresos',
        data: topNombres.map(n => resumenIngresos[n] || 0),
        backgroundColor: '#52b788'
      },
      {
        label: 'Egresos',
        data: topNombres.map(n => resumenEgresos[n] || 0),
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
      text: 'Ingresos vs Egresos por Producto',
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
