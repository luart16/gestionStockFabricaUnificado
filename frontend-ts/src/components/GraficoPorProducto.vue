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
        @click="exportarResumenAExcel"
      >
        Exportar a Excel
      </button>
    </div>

    

    <!-- Tabla -->
    <table class="table table-bordered table-striped mt-4">
      <thead class="table-light">
        <tr>
          <th>Producto</th>
          <th class="text-end">
            {{ labelColumna }}
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
            {{ dato.cantidad }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import * as XLSX from 'xlsx'
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
  datos: { nombre: string; cantidad: number }[]
  colorBarra: string
  tituloGrafico: string
  labelColumna: string
  nombreArchivoExcel: string
}>()

const busqueda = ref('')
const limite = ref(10)

const resumenPorProducto = computed(() => {
  const resumen: Record<string, number> = {}
  props.datos.forEach(item => {
    const clave = item.nombre || 'Sin nombre'
    resumen[clave] = (resumen[clave] || 0) + (item.cantidad || 0)
  })
  return resumen
})

const nombresFiltradosOrdenados = computed(() => {
  return Object.keys(resumenPorProducto.value)
    .filter(n => n.toLowerCase().includes(busqueda.value.toLowerCase()))
    .sort((a, b) => resumenPorProducto.value[b] - resumenPorProducto.value[a])
    .slice(0, limite.value)
})

const datosGrafico = computed(() => ({
  labels: nombresFiltradosOrdenados.value,
  datasets: [{
    label: props.labelColumna,
    data: nombresFiltradosOrdenados.value.map(n => resumenPorProducto.value[n]),
    backgroundColor: props.colorBarra
  }]
}))

const tablaFiltrada = computed(() =>
  nombresFiltradosOrdenados.value.map(nombre => ({
    nombre,
    cantidad: resumenPorProducto.value[nombre]
  }))
)

const exportarResumenAExcel = () => {
  if (tablaFiltrada.value.length === 0) {
    alert('No hay datos para exportar')
    return
  }

  const hoja = XLSX.utils.json_to_sheet(tablaFiltrada.value)
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
      ticks: { color: '#0b090a' }, //color de las etiquetas (números) en el eje Y
      grid: { color: '#bcbdc2' }, //color de las líneas de la grilla del fondo (las líneas que guían la lectura)
      border: { color: '#0b090a', width: 1 } //color del borde del área del gráfico.
    },
    x: {
      ticks: { color: '#0b090a' },//color de las etiquetas (números) en el eje x
      grid: { color: '#bcbdc2' }, //color de las líneas de la grilla del fondo (las líneas que guían la lectura)
      border: { color: '#0b090a', width: 1 } //color del borde del área del gráfico.
    }
  }
}
</script>
