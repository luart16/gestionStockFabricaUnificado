<!-- <template>
  <div style="max-width: 1000px; margin: auto;"> -->
    <!-- Controles -->
    <!-- <div class="d-flex flex-wrap gap-3 mb-4 align-items-end">
      <div>
        <label class="form-label fw-semibold">Buscar producto:</label>
        <input v-model="busqueda" type="text" class="form-control" placeholder="Nombre del producto" />
      </div>

      <div>
        <label class="form-label fw-semibold">Cantidad de productos:</label>
        <select v-model="limite" class="form-select">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div> -->

      <!-- Botón para exportar a excel -->
      <!-- <div class="ms-auto">
        <button class="btn btn-exportar-pagina" @click="exportarResumenAExcel">Exportar a Excel</button>
      </div>
    </div> -->

    <!-- Botón descargar gráfico como imagen
<button class="btn btn-outline-secondary" @click="exportarGraficoComoPNG">Descargar gráfico</button> -->


    <!-- Gráfico
    <Bar v-if="datosGrafico.labels.length" :data="datosGrafico" :options="opcionesGrafico" />
    <p v-else>No hay datos disponibles para mostrar.</p>

    <!-- Tabla -->
    <!-- <table v-if="tablaFiltrada.length" class="table table-bordered table-striped mt-4">
      <thead class="table-light">
        <tr>
          <th>Producto</th>
          <th class="text-end">Cantidad Ingresada</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dato, index) in tablaFiltrada" :key="index">
          <td>{{ dato.nombre }}</td>
          <td class="text-end">{{ dato.cantidad }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template> --> 

<!-- <script setup lang="ts">
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
  ingresos: { nombre: string; cantidad: number }[]
}>()

const busqueda = ref('')
const limite = ref(10)

const resumenPorProducto = computed(() => {
  const resumen: Record<string, number> = {}
  props.ingresos.forEach(item => {
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
    label: 'Cantidad Ingresada',
    data: nombresFiltradosOrdenados.value.map(n => resumenPorProducto.value[n]),
    backgroundColor: '#058c42'
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
  XLSX.utils.book_append_sheet(libro, hoja, 'ResumenIngresos')

  XLSX.writeFile(libro, 'Resumen_Ingresos_Productos.xlsx')
} -->

<!-- /*Función para exportar el gráfico de excel como imagen: */ -->

<!-- const exportarGraficoComoPNG = () => {
  const canvas = document.querySelector('canvas')
  if (!canvas) return

  const backgroundColor = '#ffffff' // Fondo blanco

  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = canvas.width
  exportCanvas.height = canvas.height

  const ctx = exportCanvas.getContext('2d')
  if (!ctx) return -->

  <!-- // Poner fondo blanco
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)

  // Copiar el contenido original
  ctx.drawImage(canvas, 0, 0)

  // Descargar la imagen
  const enlace = document.createElement('a')
  enlace.download = 'grafico.png'
  enlace.href = exportCanvas.toDataURL('image/png')
  enlace.click()
} -->

<!-- const opcionesGrafico = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: {
      display: true,
      text: 'Top Productos Con Más Ingresos',
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
</script> -->
