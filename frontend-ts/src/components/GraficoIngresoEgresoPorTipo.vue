<template>
  <div style="max-width: 800px; margin: auto;">
    <!-- Gráfico -->
    <Bar v-if="datosGrafico.labels.length" :data="datosGrafico" :options="opcionesGrafico" />
    <p v-else>No hay datos disponibles para mostrar.</p>

    <!-- Tabla comparativa -->
    <table v-if="tablaDatos.length" class="table table-bordered table-striped mt-4">
      <thead class="table-light">
        <tr>
          <th>Tipo de Producto</th>
          <th class="text-end">Ingresos</th>
          <th class="text-end">Egresos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(fila, index) in tablaDatos" :key="index">
          <td>{{ fila.tipo }}</td>
          <td class="text-end">{{ fila.ingresos }}</td>
          <td class="text-end">{{ fila.egresos }}</td>
        </tr>
      </tbody>
    </table>
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

const tipos = ['piedra', 'placa', 'piso']

// Resúmenes
const resumenIngresos = computed(() => {
  const resumen: Record<string, number> = { piedra: 0, placa: 0, piso: 0 }
  props.ingresos.forEach(item => {
    const tipo = item.tipoProducto.toLowerCase()
    if (tipo in resumen) resumen[tipo] += item.cantidad || 0
  })
  return resumen
})

const resumenEgresos = computed(() => {
  const resumen: Record<string, number> = { piedra: 0, placa: 0, piso: 0 }
  props.egresos.forEach(item => {
    const tipo = item.tipoProducto.toLowerCase()
    if (tipo in resumen) resumen[tipo] += item.cantidad || 0
  })
  return resumen
})

// Datos del gráfico
const datosGrafico = computed(() => ({
  labels: tipos.map(tipo => tipo.charAt(0).toUpperCase() + tipo.slice(1)),
  datasets: [
    {
      label: 'Ingresos',
      data: tipos.map(t => resumenIngresos.value[t]),
      backgroundColor: '#52b788'
    },
    {
      label: 'Egresos',
      data: tipos.map(t => resumenEgresos.value[t]),
      backgroundColor: '#e76f51'
    }
  ]
}))

// Datos para la tabla
const tablaDatos = computed(() =>
  tipos.map(tipo => ({
    tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    ingresos: resumenIngresos.value[tipo],
    egresos: resumenEgresos.value[tipo]
  }))
)

// Opciones del gráfico
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
