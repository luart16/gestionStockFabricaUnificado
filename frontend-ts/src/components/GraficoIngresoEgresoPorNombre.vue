<template>
  <div style="max-width: 1000px; margin: auto;">
    <!-- Controles -->
    <div class="d-flex flex-wrap gap-3 mb-4 align-items-end">
      <div>
        <label class="form-label fw-semibold">Buscar producto:</label>
        <input
          v-model="busqueda"
          type="text"
          class="form-control"
          placeholder="Nombre del producto"
        >
      </div>

      <div>
        <label class="form-label fw-semibold">Cantidad de productos:</label>
        <select
          v-model="limite"
          class="form-select"
        >
          <option :value="5">
            5
          </option>
          <option :value="10">
            10
          </option>
          <option :value="20">
            20
          </option>
          <option :value="50">
            50
          </option>
        </select>
      </div>
    </div>

    <!-- Gráfico -->
    <Bar datosGrafico.labels :data="datosGrafico" :options="opcionesGrafico" />

    <!-- Botones de exportación (solo si hay datos) -->
    <div
      datosGrafico.labels.length
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
        @click="exportarAExcel"
      >
        Exportar tabla a Excel
      </button>
    </div>

    <!-- Tabla -->
    <table class="table table-bordered table-striped mt-4">
      <thead class="table-light">
        <tr>
          <th>Producto</th>
          <th class="text-end">
            Ingresos
          </th>
          <th class="text-end">
            Egresos
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(dato, index) in tablaFiltrada"
          :key="index"
        >
          <td>{{ dato.nombre }}</td>
          <td class="text-end">
            {{ dato.ingresos }}
          </td>
          <td class="text-end">
            {{ dato.egresos }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
  ingresos: { nombre: string; cantidad: number }[]
  egresos: { nombre: string; cantidad: number }[]
}>()

const busqueda = ref('')
const limite = ref(10)

const resumenIngresos = computed(() => {
  const resumen: Record<string, number> = {}
  props.ingresos.forEach(item => {
    const clave = item.nombre || 'Sin nombre'
    resumen[clave] = (resumen[clave] || 0) + (item.cantidad || 0)
  })
  return resumen
})

const resumenEgresos = computed(() => {
  const resumen: Record<string, number> = {}
  props.egresos.forEach(item => {
    const clave = item.nombre || 'Sin nombre'
    resumen[clave] = (resumen[clave] || 0) + (item.cantidad || 0)
  })
  return resumen
})

const nombresFiltradosOrdenados = computed(() => {
  const nombresUnicos = Array.from(
    new Set([...Object.keys(resumenIngresos.value), ...Object.keys(resumenEgresos.value)])
  )

  return nombresUnicos
    .filter(n => n.toLowerCase().includes(busqueda.value.toLowerCase()))
    .sort((a, b) => (resumenIngresos.value[b] || 0) - (resumenIngresos.value[a] || 0))
    .slice(0, limite.value)
})

const datosGrafico = computed(() => ({
  labels: nombresFiltradosOrdenados.value,
  datasets: [
    {
      label: 'Ingresos',
      data: nombresFiltradosOrdenados.value.map(n => resumenIngresos.value[n] || 0),
      backgroundColor: '#573c9d'
    },
    {
      label: 'Egresos',
      data: nombresFiltradosOrdenados.value.map(n => resumenEgresos.value[n] || 0),
      backgroundColor: '#ef5769'
    }
  ]
}))

const tablaFiltrada = computed(() =>
  nombresFiltradosOrdenados.value.map(nombre => ({
    nombre,
    ingresos: resumenIngresos.value[nombre] || 0,
    egresos: resumenEgresos.value[nombre] || 0
  }))
)

const exportarAExcel = () => {
  const hoja = XLSX.utils.json_to_sheet(tablaFiltrada.value)
  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'IngresosVsEgresos')
  XLSX.writeFile(libro, 'Ingresos_vs_Egresos.xlsx')
}

/*Función para exportar el gráfico de excel como imagen: */

const exportarGraficoComoPNG = () => {
  const canvas = document.querySelector('canvas')
  if (!canvas) return

  const backgroundColor = '#ffffff' // Fondo blanco

  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = canvas.width
  exportCanvas.height = canvas.height

  const ctx = exportCanvas.getContext('2d')
  if (!ctx) return

  // Poner fondo blanco
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)

  // Copiar el contenido original
  ctx.drawImage(canvas, 0, 0)

  // Descargar la imagen
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
