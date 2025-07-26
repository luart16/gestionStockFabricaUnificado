<template>
  <div style="max-width: 800px; margin: auto;">
    <!-- Gráfico -->
    <Bar v-if="datosGrafico.labels.length" :data="datosGrafico" :options="opcionesGrafico" />
    <p v-else>No hay datos disponibles para mostrar.</p>

    <!-- Tabla de datos -->
    <table v-if="tablaDatos.length" class="table table-bordered table-striped mt-4">
      <thead class="table-light">
        <tr>
          <th>Tipo de Producto</th>
          <th class="text-end">Cantidad Ingresada</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(fila, index) in tablaDatos" :key="index">
          <td>{{ fila.tipo }}</td>
          <td class="text-end">{{ fila.cantidad }}</td>
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
}>()

// Cálculo del resumen por tipo
const resumen = computed(() => {
  const resumen: Record<string, number> = {
    piedra: 0,
    placa: 0,
    piso: 0
  }

  props.ingresos.forEach(item => {
    const tipo = item.tipoProducto.toLowerCase()
    if (resumen[tipo] !== undefined) {
      resumen[tipo] += item.cantidad || 0
    }
  })

  return resumen
})

// Datos para el gráfico
const datosGrafico = computed(() => ({
  labels: ['Piedra', 'Placa', 'Piso'],
  datasets: [{
    label: 'Cantidad Ingresada',
    data: [resumen.value.piedra, resumen.value.placa, resumen.value.piso],
    backgroundColor: ['#d62828', '#f77f00', '#fcbf49']
  }]
}))

// Datos para la tabla
const tablaDatos = computed(() => [
  { tipo: 'Piedra', cantidad: resumen.value.piedra },
  { tipo: 'Placa', cantidad: resumen.value.placa },
  { tipo: 'Piso', cantidad: resumen.value.piso }
])

// Opciones del gráfico
const opcionesGrafico = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: {
      display: true,
      text: 'Comparativa de Ingresos por Tipo de Producto',
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
