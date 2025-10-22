<template>
  <div v-if="store.Logueado" class="contenido-app">
    <NavBar />
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 class="titulo">
          Historial de Movimientos de Stock
        </h1>
      </div>

      <!-- Cargando -->
      <div v-if="cargando" class="text-center my-4">
        <div class="spinner-border" role="status" style="color: rgb(70, 40, 110); vertical-align: middle;" />
        <span style="margin-left: 8px; vertical-align: middle;">Cargando...</span>
      </div>

      <div class="d-flex mb-4 flex-wrap gap-3 align-items-end">
        <label class="form-label fw-semibold">Filtro:</label>

        <input v-model="datoAFiltar" type="text" class="form-control"
          placeholder="Buscar por tipo producto, movimiento, nombre o color" style="max-width: 650px;">

        <div>
          <label class="form-label fw-semibold">Fecha inicial:</label>
          <input v-model="fechaInicial" type="date" class="form-control">
        </div>

        <div>
          <label class="form-label fw-semibold">Fecha final:</label>
          <input v-model="fechaFinal" type="date" class="form-control">
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-gris-a-blanco" @click="traerStock">
            Buscar
          </button>
          <button class="btn btn-gris-a-blanco" @click="limpiarFechas">
            Limpiar Fechas
          </button>
        </div>
      </div>

      <div v-if="listaStock.length == 0">
        <p class="subtitulo-1 m-0 ">
          No hay datos disponibles para mostrar
        </p>
      </div>
      <div v-else>
        <div class="d-flex mb-4 flex-wrap gap-3">
          <!-- Selector de cantidad por página -->
          <div class="d-flex align-items-end">
            <label class="form-label me-2">Mostrar:</label>
            <select v-model="totalPorpagina" class="form-select" style="width: auto;"
              @change="cambiarCantidadPorPagina">
              <option :value="10">10 por página</option>
              <option :value="20">20 por página</option>
              <option :value="50">50 por página</option>
            </select>
          </div>

          <!-- Botón exportar página -->
          <div class="d-flex align-items-end">
            <button class="btn btn-exportar-pagina" @click="exportarAExcel">
              Exportar Página
            </button>
          </div>

          <!-- Botón exportar todo -->
          <div class="d-flex align-items-end">
            <button class="btn btn-exportar-todo" @click="exportarHistorialCompletoAExcel">
              Exportar Todo
            </button>
          </div>
        </div>

        <!-- Vista de tabla para pantallas grandes -->
        <div class="table-responsive d-none d-md-block">
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
                'fila-egreso': stock.tipoMovimiento === 'EGRESO',
                'fila-compromiso': stock.tipoMovimiento === 'COMPROMETIDO' || stock.tipoMovimiento === 'DESCOMPROMETIDO'
              }">
                <td>{{ new Date(stock.fecha).toLocaleString('es-AR') }}</td>
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

        <!-- Vista tipo tarjeta para pantallas pequeñas -->
        <div class="d-md-none">
          <div v-for="(stock, index) in listaStock" :key="'card-' + index" class="card mb-3" :class="{
            'fila-ingreso': stock.tipoMovimiento === 'INGRESO',
            'fila-egreso': stock.tipoMovimiento === 'EGRESO',
            'fila-compromiso': stock.tipoMovimiento === 'COMPROMETIDO' || stock.tipoMovimiento === 'DESCOMPROMETIDO'
          }">
            <div class="card-body">
              <h5 class="card-title mb-2">{{ stock.nombre }} ({{ stock.color }})</h5>
              <p class="card-text mb-1"><strong>Fecha:</strong> {{ new Date(stock.fecha).toLocaleString('es-AR') }}</p>

              <p class="card-text mb-1"><strong>Tipo Producto:</strong> {{ stock.tipoProducto }}</p>
              <p class="card-text mb-1"><strong>Movimiento:</strong> {{ stock.tipoMovimiento }}</p>
              <p class="card-text mb-1"><strong>Cantidad:</strong> {{ stock.cantidad }}</p>
              <p class="card-text mb-1"><strong>Stock Final:</strong> {{ stock.stockFinal }}</p>
              <p class="card-text mb-0"><strong>Observación:</strong> {{ stock.observacion }}</p>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <nav class="d-flex justify-content-center mt-4">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: paginaActual === 1 }">
              <button class="page-link" @click="cambiarPagina(paginaActual - 1)">
                «
              </button>
            </li>

            <li v-for="pagina in paginasTotales" :key="pagina" class="page-item"
              :class="{ active: pagina === paginaActual }">
              <button class="page-link" @click="cambiarPagina(pagina)">
                {{ pagina }}
              </button>
            </li>

            <li class="page-item" :class="{ disabled: paginaActual === paginasTotales }">
              <button class="page-link" @click="cambiarPagina(paginaActual + 1)">
                »
              </button>
            </li>
          </ul>
        </nav>
      </div>
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
    cargando.value = true;

    // 🔍 Mostramos qué fechas tiene actualmente el filtro
    console.log('Fechas seleccionadas:', {
      fechaInicial: fechaInicial.value,
      fechaFinal: fechaFinal.value
    });

    // Convertir fechas a formato ISO sin ajustes de zona horaria
    const fechaInicioISO = fechaInicial.value || '';
    const fechaFinISO = fechaFinal.value || '';

    // 🔍 Mostramos exactamente qué se va a enviar al backend
    console.log('Parámetros enviados al backend:', {
      pagina: paginaActual.value,
      totalPorpagina: totalPorpagina.value,
      filtro: datoAFiltar.value,
      fechaInicioISO,
      fechaFinISO
    });

    // Petición al backend
    const respuesta = await servicioMovimientoStock.traerTodos(
      paginaActual.value,
      totalPorpagina.value,
      datoAFiltar.value,
      fechaInicioISO,
      fechaFinISO
    );

    // 🔍 Mostramos qué devuelve el backend (solo los primeros 3 para no saturar)
    console.log('Respuesta del backend (primeros 3 movimientos):', respuesta.resultados.slice(0, 3));

    // Guardamos y ordenamos los resultados
    listaStock.value = respuesta.resultados;
    paginasTotales.value = respuesta.paginasTotales;

    listaStock.value.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  } catch (error) {
    console.error('Error al traer stock:', error);
  } finally {
    cargando.value = false;
  }
};

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
  color: rgb(70, 40, 110);
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}

/*Color verde, rojo gris para las filas ingreso, egreso, etc */
table.table tr.fila-ingreso td {
  background-color: #aeeea7 !important;
}

table.table tr.fila-egreso td {
  background-color: #f8d7d7 !important;
}

table.table tr.fila-compromiso td {
  background-color: #ece39c !important;
}

/*Ato de las celdas cabeceras: */
.table thead th {
  line-height: 3;
}

/*Colores para tabla convertida a card en celular: */
.card.fila-ingreso .card-body {
  background-color: #aeeea7 !important;
}

.card.fila-egreso .card-body {
  background-color: #f8d7d7 !important;
}

.card.fila-compromiso .card-body {
  background-color: #ece39c !important;
}

/*El resto de los estilos están en el archivo styles.css porque son globales */
</style>
