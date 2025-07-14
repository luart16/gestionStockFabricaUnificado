<template>
  <div v-if="store.Logueado">
    <div v-if="store.Rol == 'administrador'">
      <NavBar />
      <div class="container py-4">

        <h1 class="text-center text-primary fw-bold mb-4">Historial de Movimientos de Stock</h1>

        <div class="row g-3 align-items-end mb-4">
          <div class="col-md-4">
            <label class="form-label fw-semibold">Filtrar por nombre</label>
            <input type="text" class="form-control" v-model="datoAFiltar" placeholder="Buscar producto..." />
          </div>

          <div class="col-md-3">
            <label class="form-label fw-semibold">Fecha inicial</label>
            <input type="date" class="form-control" v-model="fechaInicial" />
          </div>

          <div class="col-md-3">
            <label class="form-label fw-semibold">Fecha final</label>
            <input type="date" class="form-control" v-model="fechaFinal" />
          </div>

          <div class="col-md-2 d-grid">
            <button class="btn btn-primary" @click="traerStock">Buscar</button>
          </div>
        </div>

        <div class="d-flex justify-content-between mb-3 flex-wrap gap-2">
          <button class="btn btn-secondary" @click="limpiarFechas">Limpiar Fechas</button>
          <div class="d-flex gap-2">
            <button class="btn btn-success" @click="exportarAExcel">Exportar Página a Excel</button>
            <button class="btn btn-warning text-white" @click="exportarHistorialCompletoAExcel">Exportar Todo</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-hover align-middle">
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
              <tr v-for="(stock, index) in listaStock" :key="index">
                <td>{{ new Date(stock.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' }) }}</td>
                <td>{{ stock.tipoProducto }}</td>
                <td>{{ stock.nombre }}</td>
                <td>{{ stock.color }}</td>
                <td>{{ stock.tipoMovimiento }}</td>
                <td>{{ stock.cantidad }}</td>
                <td>{{ stock.stockFinal }}</td>
                <td>{{ stock.observacion }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-center mt-4">
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                <button class="page-link" @click="cambiarPagina(paginaActual - 1)">«</button>
              </li>

              <li class="page-item" v-for="pagina in paginasTotales" :key="pagina" :class="{ active: pagina === paginaActual }">
                <button class="page-link" @click="cambiarPagina(pagina)">{{ pagina }}</button>
              </li>

              <li class="page-item" :class="{ disabled: paginaActual === paginasTotales }">
                <button class="page-link" @click="cambiarPagina(paginaActual + 1)">»</button>
              </li>
            </ul>
          </nav>
        </div>

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
const totalPorpagina = 10

const fechaInicial = ref('')
const fechaFinal = ref('')

// Limpiar filtros de fecha
const limpiarFechas = () => {
  fechaInicial.value = ''
  fechaFinal.value = ''
  traerStock()
}


//Paginación:
const cambiarPagina = (newPage: number) => {

  if (newPage < 1 || newPage > paginasTotales.value) return;
  paginaActual.value = newPage;
  traerStock()
}

const listaStock = ref<DatosHistorialMovimientosStock[]>([])
const traerStock = async () => {
  try {
    // Convertir fechas a formato ISO sin ajustes de zona horaria
    const fechaInicioISO = fechaInicial.value
      ? new Date(fechaInicial.value).toISOString().split('T')[0]
      : '';

    const fechaFinISO = fechaFinal.value
      ? new Date(fechaFinal.value).toISOString().split('T')[0]
      : '';

    const respuesta = await servicioMovimientoStock.traerTodos(
      paginaActual.value,
      totalPorpagina,
      datoAFiltar.value,
      fechaInicioISO,  // Enviar fechas en formato YYYY-MM-DD
      fechaFinISO      // sin información de zona horaria
    );

    listaStock.value = respuesta.resultados;
    paginasTotales.value = respuesta.paginasTotales;
    listaStock.value.sort((a, b) =>
      a.tipoProducto.localeCompare(b.tipoProducto, 'es', { sensitivity: 'base' }))
    console.log(listaStock.value)
  } catch (error) {
    console.error('Error al traer stock:', error)
  }
}

// Función debounce genérica (para filtar mientras se escribe)
function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number) {
  let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// Versión con debounce de traerStock
const traerStockDebounce = debounce(() => {
  paginaActual.value = 1 // Siempre vuelve a la primera página al buscar
  traerStock()
}, 500) // 500 ms de espera

// Watch que llama traerStockDebounce al escribir
watch(datoAFiltar, () => {
  traerStockDebounce()
})

//para exportar a excel por página: 
const exportarAExcel = () => {
  if (listaStock.value.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  const datosPlanos = listaStock.value.map(stock => ({
    Fecha: stock.fecha,
    "Tipo Producto": stock.tipoProducto,
    Producto: stock.nombre,
    Color: stock.color,
    "Tipo de Movimiento": stock.tipoMovimiento,
    Cantidad: stock.cantidad,
    "Stock Final": stock.stockFinal,
    Observación: stock.observacion
  }));

  const hoja = XLSX.utils.json_to_sheet(datosPlanos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'HistorialStock');

  XLSX.writeFile(libro, 'Historial_Movimientos_Stock.xlsx');
}

//para exportar a excel todo sin paginación:
const exportarHistorialCompletoAExcel = async () => {
  try {
    const todosLosMovimientos: DatosHistorialMovimientosStock[] = await servicioMovimientoStock.traerTodosMovimientosSinPaginacion();
    console.log('Movimientos traidos', todosLosMovimientos)
    if (!todosLosMovimientos || todosLosMovimientos.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Mapear para exportar solo las columnas que quieras
    const datosPlanos = todosLosMovimientos.map(mov => ({
      Fecha: mov.fecha,
      'Tipo Producto': mov.tipoProducto,
      Producto: mov.nombre,
      Color: mov.color,
      'Tipo de Movimiento': mov.tipoMovimiento,
      Cantidad: mov.cantidad,
      'Stock Final': mov.stockFinal,
      Observación: mov.observacion
    }));

    const hoja = XLSX.utils.json_to_sheet(datosPlanos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'HistorialCompleto');

    XLSX.writeFile(libro, 'Historial_Movimientos_Completo.xlsx');
  } catch (error) {
    console.error('Error al exportar historial completo:', error);
    alert('Error al exportar el historial completo.');
  }
};


onMounted(() => {
  traerStock()
})
</script>


<style scoped>
h1 {
  font-size: 2.5rem;
}
</style>
