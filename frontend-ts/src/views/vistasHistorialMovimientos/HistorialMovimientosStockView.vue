<template>
  <div v-if="store.Logueado" class="contenido-app">
    <div v-if="store.Rol == 'administrador'">
      <NavBar />
      <div class="container py-4">

        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 class="titulo">Historial de Movimientos de Stock</h1>
        </div>

        <!-- Cargando -->
        <div v-if="cargando" class="text-center my-4">
          <div class="spinner-border" role="status" style="color: rgb(70, 40, 110); vertical-align: middle;"></div>
          <span style="margin-left: 8px; vertical-align: middle;">Cargando...</span>
        </div>

        <div class="d-flex mb-4 flex-wrap gap-3 align-items-end">

          <label class="form-label fw-semibold">Filtro:</label>

          <input type="text" v-model="datoAFiltar" class="form-control"
            placeholder="Buscar por tipo producto, nombre o color" style="max-width: 650px;" />

          <div>
            <label class="form-label fw-semibold">Fecha inicial:</label>
            <input type="date" class="form-control" v-model="fechaInicial" />
          </div>

          <div>
            <label class="form-label fw-semibold">Fecha final:</label>
            <input type="date" class="form-control" v-model="fechaFinal" />
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-gris-a-blanco" @click="traerStock">Buscar</button>
            <button class="btn btn-gris-a-blanco" @click="limpiarFechas">Limpiar Fechas</button>
          </div>

        </div>


        <div class="d-flex mb-4 flex-wrap gap-3">

          <!-- Selector de cantidad por página -->
          <div class="d-flex align-items-end">
            <label class="form-label me-2">Mostrar:</label>
            <select class="form-select" style="width: auto;" v-model="totalPorpagina"
              @change="cambiarCantidadPorPagina">
              <option :value="10">10 por página</option>
              <option :value="20">20 por página</option>
              <option :value="50">50 por página</option>
            </select>
          </div>

          <!-- Botón exportar página -->
          <div class="d-flex align-items-end">
            <button class="btn btn-exportar-pagina" @click="exportarAExcel">Exportar Página</button>
          </div>

          <!-- Botón exportar todo -->
          <div class="d-flex align-items-end">
            <button class="btn btn-exportar-todo" @click="exportarHistorialCompletoAExcel">Exportar Todo</button>
          </div>
        </div>


        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>Fecha</th>
                <th>Tipo Producto</th>
                <th>Producto</th>
                <th>Color</th>
                <th>Tipo Movimiento</th>
                <th>Cantidad</th>
                <th>Stock Final</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(stock, index) in listaStock" :key="index" :class="{
                'fila-ingreso': stock.tipoMovimiento === 'INGRESO',
                'fila-egreso': stock.tipoMovimiento === 'EGRESO', 'fila-compromiso': stock.tipoMovimiento === 'COMPROMETIDO' || stock.tipoMovimiento === 'DESCOMPROMETIDO'
              }"><!--Puse esa clases fila-ingreso fila-egreso para darle color verde o rojo-->
                <td>{{ new Date(stock.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' }) }}</td>
                <td>{{ stock.tipoProducto }}</td>
                <td>{{ stock.nombre }}</td>
                <td>{{ stock.color }}</td>
                <td>{{ stock.tipoMovimiento }}</td>
                <td>{{ stock.cantidad }}</td>
                <td class="fw-bold">{{ stock.stockFinal }}</td>
                <td>{{ stock.observacion }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <nav class="d-flex justify-content-center mt-4">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: paginaActual === 1 }">
              <button class="page-link" @click="cambiarPagina(paginaActual - 1)">«</button>
            </li>

            <li class="page-item" v-for="pagina in paginasTotales" :key="pagina"
              :class="{ active: pagina === paginaActual }">
              <button class="page-link" @click="cambiarPagina(pagina)">{{ pagina }}</button>
            </li>

            <li class="page-item" :class="{ disabled: paginaActual === paginasTotales }">
              <button class="page-link" @click="cambiarPagina(paginaActual + 1)">»</button>
            </li>
          </ul>
        </nav>

      </div>
    </div>
    <div v-else>
      <RequiereRol />
    </div>
  </div>
  <div v-else>
    <RequiereLogin />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'

import NavBar from '@/components/BarraNavegacion.vue'
import RequiereLogin from '@/components/RequiereLogin.vue'
import RequiereRol from '@/components/RequiereRol.vue'
import { userStore } from '@/store/user'
import { DatosHistorialMovimientosStock } from '@/modelos/historialMovimientoStock'
import { servicioMovimientoStock } from '@/services/movimientoStock.service'

const store = userStore()

const datoAFiltar = ref('')
const paginaActual = ref(1)
const paginasTotales = ref(10)
const totalPorpagina = ref(10)

const fechaInicial = ref('')
const fechaFinal = ref('')

const cargando = ref(false)

// Limpiar filtros de fecha
const limpiarFechas = () => {
  fechaInicial.value = ''
  fechaFinal.value = ''
  traerStock()
}

// Paginación:
const cambiarPagina = (newPage: number) => {
  if (newPage < 1 || newPage > paginasTotales.value) return
  paginaActual.value = newPage
  traerStock()
}

//Cambiar la cantidad por página:
const cambiarCantidadPorPagina = () => {
  paginaActual.value = 1
  traerStock()
}

const listaStock = ref<DatosHistorialMovimientosStock[]>([])
const traerStock = async () => {
  try {
    cargando.value = true
    // Convertir fechas a formato ISO sin ajustes de zona horaria
    const fechaInicioISO = fechaInicial.value
      ? new Date(fechaInicial.value).toISOString().split('T')[0]
      : ''

    const fechaFinISO = fechaFinal.value
      ? new Date(fechaFinal.value).toISOString().split('T')[0]
      : ''

    const respuesta = await servicioMovimientoStock.traerTodos(
      paginaActual.value,
      totalPorpagina.value,
      datoAFiltar.value,
      fechaInicioISO,
      fechaFinISO
    )

    listaStock.value = respuesta.resultados
    paginasTotales.value = respuesta.paginasTotales

    //ordeno la lista de movimientos por fecha más nueva a más antigua:
    listaStock.value.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  } catch (error) {
    console.error('Error al traer stock:', error)
  } finally {
    cargando.value = false
  }
}

// Función debounce genérica (para filtrar mientras se escribe)
function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number) {
  let timeout: number | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// Versión con debounce de traerStock
const traerStockDebounce = debounce(() => {
  paginaActual.value = 1 // Siempre vuelve a la primera página al buscar
  traerStock()
}, 500)

// Watch que llama traerStockDebounce al escribir
watch(datoAFiltar, () => {
  traerStockDebounce()
})

// para exportar a excel por página:
const exportarAExcel = () => {
  if (listaStock.value.length === 0) {
    alert('No hay datos para exportar')
    return
  }

  const datosPlanos = listaStock.value.map((stock) => ({
    Fecha: stock.fecha,
    'Tipo Producto': stock.tipoProducto,
    Producto: stock.nombre,
    Color: stock.color,
    'Tipo de Movimiento': stock.tipoMovimiento,
    Cantidad: stock.cantidad,
    'Stock Final': stock.stockFinal,
    Observación: stock.observacion
  }))

  const hoja = XLSX.utils.json_to_sheet(datosPlanos)
  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'HistorialStock')

  XLSX.writeFile(libro, 'Historial_Movimientos_Stock.xlsx')
}

// para exportar a excel todo sin paginación:
const exportarHistorialCompletoAExcel = async () => {
  try {
    const todosLosMovimientos: DatosHistorialMovimientosStock[] =
      await servicioMovimientoStock.traerTodosMovimientosSinPaginacion()

    if (!todosLosMovimientos || todosLosMovimientos.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    // Mapear para exportar solo las columnas que quieras
    const datosPlanos = todosLosMovimientos.map((mov) => ({
      Fecha: mov.fecha,
      'Tipo Producto': mov.tipoProducto,
      Producto: mov.nombre,
      Color: mov.color,
      'Tipo de Movimiento': mov.tipoMovimiento,
      Cantidad: mov.cantidad,
      'Stock Final': mov.stockFinal,
      Observación: mov.observacion
    }))

    const hoja = XLSX.utils.json_to_sheet(datosPlanos)
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, 'HistorialCompleto')

    XLSX.writeFile(libro, 'Historial_Movimientos_Completo.xlsx')
  } catch (error) {
    console.error('Error al exportar historial completo:', error)
    alert('Error al exportar el historial completo.')
  }
}

onMounted(() => {
  traerStock()
})
</script>

<style scoped>
.titulo {
  font-size: 36px;
  color: #ff6b8a;
  font-weight: 600;
}



/*Color verde, rojo gris para las filas ingreso, egreso, etc */
table.table tr.fila-ingreso td {
  background-color: #aeeea7   !important;
}

table.table tr.fila-egreso td {
  background-color: #f8d7d7    !important;
}

table.table tr.fila-compromiso td {
  background-color: #ece39c    !important;
}

/*Ato de las celdas cabeceras: */
.table thead th {line-height: 3; }

/*El resto de los estilos están en el archivo styles.css porque son globales */
</style>
