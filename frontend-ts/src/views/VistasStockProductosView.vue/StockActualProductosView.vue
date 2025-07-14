<template>
  <div v-if="store.Logueado">
    <div v-if="store.Rol == 'administrador'">
      <NavBar />
      <div class="container py-4">

        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 class="titulo">Stock Actual de Productos</h1>
          <router-link to="/historialMovimientosDeStock">
            <button class="btn btn-outline-primary">Historial de Movimientos</button>
          </router-link>
        </div>

        <div class="d-flex mb-4 flex-wrap gap-3">

          <label class="form-label fw-semibold">Filtro:</label>
          <input type="text" v-model="datoAFiltar" class="form-control" placeholder="Buscar por tipo producto, nombre o color" />

          <div class="d-flex align-items-end">
            <button class="btn btn-success" @click="exportarAExcel">Exportar Página</button>
          </div>
          <div class="d-flex align-items-end">
            <button class="btn btn-warning" @click="exportarStockCompletoAExcel">Exportar Todo</button>
          </div>
        </div>


        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>Tipo Producto</th>
                <th>Producto</th>
                <th>Color</th>
                <th>Moldes</th>
                <th>M2 por Molde</th>
                <th>M2 totales</th>
                <th>Unidades por paquete</th>
                <th>M2 por paquete</th>
                <th>Kg por paquete</th>
                <th>Stock Sin Comprometer</th>
                <th>Stock Comprometido</th>
                <th>Stock Final</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stock in listaStock" :key="stock._id">
                <td>{{ stock.tipoProducto }}</td>
                <td>{{ stock.nombre }}</td>
                <td>{{ stock.color }}</td>
                <td>{{ stock.moldes }}</td>
                <td>{{ stock.m2PorMolde }}</td>
                <td>{{ stock.capacidadTotal }}</td>
                <td>{{ stock.unidadesPorPaquete }}</td>
                <td>{{ stock.m2PorPaquete }}</td>
                <td>{{ stock.kgPorPaquete }}</td>
                <td>{{ stock.stockSinCompromiso }}</td>
                <td>{{ stock.comprometido }}</td>
                <td>{{ stock.stockFinal }}</td>
                <td>
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      Opciones
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#" @click.prevent="abrirModal(stock, 'INGRESO')">+ Agregar</a>
                      </li>
                      <li><a class="dropdown-item" href="#" @click.prevent="abrirModal(stock, 'EGRESO')">- Quitar</a>
                      </li>
                      <li><a class="dropdown-item" href="#"
                          @click.prevent="abrirModal(stock, 'COMPROMETIDO')">Comprometer</a></li>
                      <li><a class="dropdown-item" href="#"
                          @click.prevent="abrirModal(stock, 'DESCOMPROMETIDO')">Descomprometer</a></li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Paginacion-->
        <nav class="d-flex justify-content-center mt-4">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: paginaActual === 1 }">
              <a class="page-link" href="#" @click.prevent="cambiarPagina(paginaActual - 1)">&laquo;</a>
            </li>
            <li class="page-item" v-for="pagina in paginasTotales" :key="pagina"
              :class="{ active: pagina === paginaActual }">
              <a class="page-link" href="#" @click.prevent="cambiarPagina(pagina)">{{ pagina }}</a>
            </li>
            <li class="page-item" :class="{ disabled: paginaActual === paginasTotales }">
              <a class="page-link" href="#" @click.prevent="cambiarPagina(paginaActual + 1)">&raquo;</a>
            </li>
          </ul>
        </nav>

        <div v-if="mostrarModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ tipoMovimiento === 'COMPROMETIDO' ? 'Comprometer' : tipoMovimiento ===
                  'DESCOMPROMETIDO' ? 'Descomprometer' : tipoMovimiento === 'EGRESO' ? 'Quitar' : 'Agregar' }} Stock
                </h5>
                <button type="button" class="btn-close" @click="cerrarModal"></button>
              </div>
              <div class="modal-body">
                <p>Producto: <strong>{{ stockSeleccionado?.nombre }}</strong> - Color: <strong>{{
                    stockSeleccionado?.color }}</strong></p>
                <div class="mb-3">
                  <label class="form-label">Cantidad:</label>
                  <input type="number" class="form-control" v-model.number="cantidadMovimiento" min="1">
                </div>
                <div class="mb-3">
                  <label class="form-label">Observación:</label>
                  <input type="text" class="form-control" v-model="observacion">
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
                <button class="btn btn-primary" @click="confirmarMovimiento">Confirmar</button>
              </div>
            </div>
          </div>
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
import { servicioProducto } from '@/services/producto.service'

import type { DatosProductos } from '@/modelos/producto'

const store = userStore()

const datoAFiltar = ref('')
const paginaActual = ref(1)
const paginasTotales = ref(10)
const totalPorpagina = 10

//Paginación:
const cambiarPagina = (newPage: number) => {

  if (newPage < 1 || newPage > paginasTotales.value) return;

  paginaActual.value = newPage;

  traerStock()

}

const stockSeleccionado = ref<DatosProductos>()
const listaStock = ref<DatosProductos[]>([])
const mostrarModal = ref(false)
const tipoMovimiento = ref<'INGRESO' | 'EGRESO' | 'COMPROMETIDO' | 'DESCOMPROMETIDO'>('INGRESO')

const cantidadMovimiento = ref<number>(1)
const observacion = ref('')

const traerStock = async () => {
  try {
    const respuesta = await servicioProducto.traerTodos(
      paginaActual.value,
      totalPorpagina,
      datoAFiltar.value
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

const abrirModal = (stock: DatosProductos, tipo: 'INGRESO' | 'EGRESO' | 'COMPROMETIDO' | 'DESCOMPROMETIDO') => {
  stockSeleccionado.value = stock
  tipoMovimiento.value = tipo
  cantidadMovimiento.value = 1
  mostrarModal.value = true
}


const cerrarModal = () => {
  mostrarModal.value = false
}

const confirmarMovimiento = async () => {
  if (!stockSeleccionado.value || !stockSeleccionado.value._id) {
    console.error('Falta el productoId para el movimiento.')
    return
  }

  try {
    const movimiento = {
      tipoDeMovimiento: tipoMovimiento.value,
      cantidad: cantidadMovimiento.value,
      observacion: observacion.value
    }

    console.log("ENVIANDO:", movimiento)

    await servicioProducto.calcularStock(stockSeleccionado.value._id, movimiento)

    await traerStock() // refresca la lista
    cerrarModal() // cierra el modal
  } catch (error) {
    console.error('Error al crear movimiento:', error)
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

//para exportar página actual a excel: 
const exportarAExcel = () => {
  if (listaStock.value.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  const datosPlanos = listaStock.value.map(stock => ({
    "Tipo Producto": stock.tipoProducto,
    Producto: stock.nombre,
    Color: stock.color,
    Moldes: stock.moldes,
    "M2 por Molde": stock.m2PorMolde,
    "M2 Totales": stock.capacidadTotal,
    "Unidades por Paquete": stock.unidadesPorPaquete,
    "M2 por Paquete": stock.m2PorPaquete,
    "Kg por Paquete": stock.kgPorPaquete,
    "Stock Sin Comprometer": stock.stockSinCompromiso,
    "Stock Comprometido": stock.comprometido,
    "Stock Final": stock.stockFinal
  }));

  const hoja = XLSX.utils.json_to_sheet(datosPlanos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'StockActual');

  XLSX.writeFile(libro, 'Stock_Actual_Productos.xlsx');
}

//para exportar todo a excel sin paginación:
const exportarStockCompletoAExcel = async () => {
  try {
    const todosLosProductos: DatosProductos[] = await servicioProducto.traerTodosSinPaginacion();

    if (!todosLosProductos || todosLosProductos.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const datosPlanos = todosLosProductos.map((stock: DatosProductos) => ({
      "Tipo Producto": stock.tipoProducto,
      Producto: stock.nombre,
      Color: stock.color,
      Moldes: stock.moldes,
      "M2 por Molde": stock.m2PorMolde,
      "M2 Totales": stock.capacidadTotal,
      "Unidades por Paquete": stock.unidadesPorPaquete,
      "M2 por Paquete": stock.m2PorPaquete,
      "Kg por Paquete": stock.kgPorPaquete,
      "Stock Sin Comprometer": stock.stockSinCompromiso,
      "Stock Comprometido": stock.comprometido,
      "Stock Final": stock.stockFinal
    }));

    const hoja = XLSX.utils.json_to_sheet(datosPlanos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'StockCompleto');

    XLSX.writeFile(libro, 'Stock_Actual_Completo.xlsx');
  } catch (error) {
    console.error('Error al exportar stock completo:', error);
    alert('Error al exportar el stock completo.');
  }
};




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
</style>