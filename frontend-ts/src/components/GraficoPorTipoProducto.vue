<template>
  <div style="max-width: 800px; margin: auto;">
    <!-- Gráfico -->
    <Bar datosGrafico.labels.length :data="datosGrafico" :options="opcionesGrafico" />

    <!-- Botones de exportación (solo si hay datos) -->
    <div
      v-if="datosGrafico.labels.length"
      class="my-3 d-flex gap-3"
    >
      <button
        class="btn btn-exportar-todo"
        @click="exportarGraficoComoPNG"
      >
        Descargar gráfico
      </button>
      <button
        class="btn btn-exportar-pagina"
        @click="exportarResumenAExcel"
      >
        Exportar a Excel
      </button>
    </div>

    

    <!-- Tabla -->
    <table class="table table-bordered table-striped mt-4">
      <thead class="table-light">
        <tr>
          <th>Tipo de Producto</th>
          <th class="text-end">
            {{ labelColumna }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(fila, index) in tablaDatos"
          :key="index"
        >
          <td>{{ fila.tipo }}</td>
          <td class="text-end">
            {{ fila.cantidad }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import * as XLSX from 'xlsx'
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
  movimientos: { tipoProducto: string; cantidad: number }[]
  tituloGrafico: string
  labelColumna: string
  nombreArchivoExcel: string
}>()

const resumen = computed(() => {
  const resumen: Record<string, number> = {
    piedra: 0,
    placa: 0,
    piso: 0
  }

  props.movimientos.forEach(item => {
    const tipo = item.tipoProducto.toLowerCase()
    if (resumen[tipo] !== undefined) {
      resumen[tipo] += item.cantidad || 0
    }
  })

  return resumen
})

const datosGrafico = computed(() => ({
  labels: ['Piedra', 'Placa', 'Piso'],
  datasets: [{
    label: props.labelColumna,
    data: [resumen.value.piedra, resumen.value.placa, resumen.value.piso],
    backgroundColor: ['#573c9d', '#ef5769', '#6c757d']
  }]
}))

const tablaDatos = computed(() => [
  { tipo: 'Piedra', cantidad: resumen.value.piedra },
  { tipo: 'Placa', cantidad: resumen.value.placa },
  { tipo: 'Piso', cantidad: resumen.value.piso }
])

const exportarResumenAExcel = () => {
  const hoja = XLSX.utils.json_to_sheet(tablaDatos.value)
  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, props.nombreArchivoExcel)
  XLSX.writeFile(libro, `${props.nombreArchivoExcel}.xlsx`)
}

const exportarGraficoComoPNG = () => {
  const canvas = document.querySelector('canvas')
  if (!canvas) return

  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = canvas.width
  exportCanvas.height = canvas.height

  const ctx = exportCanvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
  ctx.drawImage(canvas, 0, 0)

  const enlace = document.createElement('a')
  enlace.download = 'grafico.png'
  enlace.href = exportCanvas.toDataURL('image/png')
  enlace.click()
}

const opcionesGrafico = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: {
      display: true,
      text: props.tituloGrafico,
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
