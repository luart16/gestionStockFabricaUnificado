<template>
  <div v-if="store.Logueado" class="contenido-app">
    <div v-if="store.Rol == 'administrador'">
      <NavBar />
      <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 class="titulo">
            Stock Actual de Productos
          </h1>
          <router-link to="/historialMovimientosDeStock">
            <button class="btn btn-gris-a-blanco">
              Historial de Movimientos
            </button>
          </router-link>
        </div>


        <div class="d-flex mb-4 flex-wrap gap-3 align-items-end">
          <!-- Filtro -->
          <label class="form-label fw-semibold">Filtro:</label>
          <input v-model="datoAFiltar" type="text" class="form-control"
            placeholder="Buscar por tipo producto, nombre o color" style="max-width: 400px;">

          <!-- Selector de cantidad por página -->
          <div class="d-flex align-items-end">
            <label class="form-label me-2">Mostrar:</label>
            <select v-model="totalPorpagina" class="form-select" style="width: auto;"
              @change="cambiarCantidadPorPagina">
              <option :value="10">
                10 por página
              </option>
              <option :value="20">
                20 por página
              </option>
              <option :value="50">
                50 por página
              </option>
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
            <button class="btn btn-exportar-todo" @click="exportarStockCompletoAExcel">
              Exportar Todo
            </button>
          </div>
        </div>

        <div v-if="listaStock.length == 0">
          <p class="subtitulo-1 m-0 ">
            No hay datos disponibles para mostrar
          </p>
        </div>
        <div v-else>
          <!-- Botones mostrar/ocultar -->
          <div class="d-flex align-items-end gap-2 mb-3">
            <button class="btn btn-outline-secondary" @click="mostrarCapacidadProduccion = !mostrarCapacidadProduccion">
              {{ mostrarCapacidadProduccion ? 'Ocultar' : 'Mostrar' }} Capacidad de Producción
            </button>
            <button class="btn btn-outline-secondary" @click="mostrarEmbalaje = !mostrarEmbalaje">
              {{ mostrarEmbalaje ? 'Ocultar' : 'Mostrar' }} Embalaje
            </button>
          </div>

          <!--Tabla de stock para vista en computadora:-->
          <div class="table-responsive d-none d-md-block">
            <table class="table table-hover table-bordered align-middle">
              <thead class="table-light">
                <tr>
                  <th rowspan="2">
                    Tipo Producto
                  </th>
                  <th rowspan="2">
                    Producto
                  </th>
                  <th rowspan="2">
                    Color
                  </th>

                  <th v-if="mostrarCapacidadProduccion" colspan="3" class="text-center align-middle">
                    Capacidad de Producción
                  </th>

                  <th v-if="mostrarEmbalaje" colspan="3" class="text-center align-middle">
                    Embalaje
                  </th>

                  <th rowspan="2">
                    Stock<br>Sin<br>Reserva
                  </th>
                  <th rowspan="2">
                    Stock<br>Con<br>Reserva
                  </th>
                  <th rowspan="2">
                    Stock<br>Final
                  </th>
                  <th rowspan="2">
                    Acciones
                  </th>
                </tr>
                <tr>
                  <template v-if="mostrarCapacidadProduccion">
                    <th class="text-center th-subtitulo">
                      Moldes
                    </th>
                    <th class="text-center th-subtitulo">
                      M2/Molde
                    </th>
                    <th class="text-center th-subtitulo">
                      M2 totales
                    </th>
                  </template>

                  <template v-if="mostrarEmbalaje">
                    <th class="text-center th-subtitulo">
                      Unid./paquete
                    </th>
                    <th class="text-center th-subtitulo">
                      M2/paquete
                    </th>
                    <th class="text-center th-subtitulo">
                      Kg/paquete
                    </th>
                  </template>
                </tr>
              </thead>

              <!--cuerpo de la tabla:-->
              <tbody>
                <tr v-for="stock in listaStock" :key="stock._id">
                  <td class="resaltar-celda">
                    {{ stock.tipoProducto }}
                  </td>
                  <td class="resaltar-celda">
                    {{ stock.nombre }}
                  </td>
                  <td class="resaltar-celda">
                    {{ stock.color }}
                  </td>

                  <td v-if="mostrarCapacidadProduccion">
                    {{ stock.moldes }}
                  </td>
                  <td v-if="mostrarCapacidadProduccion">
                    {{ stock.m2PorMolde }}
                  </td>
                  <td v-if="mostrarCapacidadProduccion">
                    {{ stock.capacidadTotal }}
                  </td>

                  <td v-if="mostrarEmbalaje">
                    {{ stock.unidadesPorPaquete }}
                  </td>
                  <td v-if="mostrarEmbalaje">
                    {{ stock.m2PorPaquete }}
                  </td>
                  <td v-if="mostrarEmbalaje">
                    {{ stock.kgPorPaquete }}
                  </td>

                  <td>{{ stock.stockSinCompromiso }}</td>
                  <td>{{ stock.comprometido }}</td>
                  <td :class="[
                    'fw-bold resaltar-celda',
                    stock.stockFinal < 0 ? 'text-danger' :
                      stock.stockFinal === 0 ? 'text-warning' :
                        'text-success'
                  ]">
                    {{ stock.stockFinal }}
                  </td>
                  <td>
                    <div class="dropdown">
                      <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Opciones
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="abrirModal(stock, 'INGRESO')">+
                            Agregar</a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="abrirModal(stock, 'EGRESO')">- Quitar</a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#"
                            @click.prevent="abrirModal(stock, 'COMPROMETIDO')">Reservar</a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="abrirModal(stock, 'DESCOMPROMETIDO')">Quitar
                            Reserva</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Cards para vista con móviles -->
          <div class="d-md-none">
            <div v-for="stock in listaStock" :key="'card-' + stock._id" class="card mb-3">
              <div class="card-body">
                <h5 class="card-title mb-2">
                  {{ stock.nombre }} ({{ stock.tipoProducto }})
                </h5>
                <p class="card-text mb-1"><strong>Color:</strong> {{ stock.color }}</p>

                <template v-if="mostrarCapacidadProduccion">
                  <p class="card-text mb-1"><strong>Capacidad de Producción:</strong></p>
                  <ul class="ps-3 mb-2">
                    <li><strong>Moldes:</strong> {{ stock.moldes }}</li>
                    <li><strong>M2/Molde:</strong> {{ stock.m2PorMolde }}</li>
                    <li><strong>M2 totales:</strong> {{ stock.capacidadTotal }}</li>
                  </ul>
                </template>

                <template v-if="mostrarEmbalaje">
                  <p class="card-text mb-1"><strong>Embalaje:</strong></p>
                  <ul class="ps-3 mb-2">
                    <li><strong>Unid./paquete:</strong> {{ stock.unidadesPorPaquete }}</li>
                    <li><strong>M2/paquete:</strong> {{ stock.m2PorPaquete }}</li>
                    <li><strong>Kg/paquete:</strong> {{ stock.kgPorPaquete }}</li>
                  </ul>
                </template>

                <p class="card-text mb-1"><strong>Stock Sin Reserva:</strong> {{ stock.stockSinCompromiso }}</p>
                <p class="card-text mb-1"><strong>Stock Con Reserva:</strong> {{ stock.comprometido }}</p>
                <p class="card-text mb-2 fw-bold" :class="{
                  'text-danger': stock.stockFinal < 0,
                  'text-warning': stock.stockFinal === 0,
                  'text-success': stock.stockFinal > 0,
                }">
                  <strong>Stock Final:</strong> {{ stock.stockFinal }}
                </p>

                <div class="d-flex gap-2 flex-wrap">
                  <button class="btn btn-outline-secondary flex-grow-1" @click="abrirModal(stock, 'INGRESO')">
                    +
                    Agregar
                  </button>
                  <button class="btn btn-outline-secondary flex-grow-1" @click="abrirModal(stock, 'EGRESO')">
                    -
                    Quitar
                  </button>
                  <button class="btn btn-outline-secondary flex-grow-1" @click="abrirModal(stock, 'COMPROMETIDO')">
                    Reservar
                  </button>
                  <button class="btn btn-outline-secondary flex-grow-1" @click="abrirModal(stock, 'DESCOMPROMETIDO')">
                    Quitar Reserva
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginacion-->
          <nav class="d-flex justify-content-center mt-4">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                <a class="page-link" href="#" @click.prevent="cambiarPagina(paginaActual - 1)">&laquo;</a>
              </li>
              <li v-for="pagina in paginasTotales" :key="pagina" class="page-item"
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
                  <h5 class="modal-title">
                    {{ tipoMovimiento === 'COMPROMETIDO' ? 'Reservar' : tipoMovimiento ===
                      'DESCOMPROMETIDO' ? 'Quitar Reserva' : tipoMovimiento === 'EGRESO' ? 'Quitar' : 'Agregar' }} Stock
                  </h5>
                  <button type="button" class="btn-close" @click="cerrarModal" />
                </div>
                <div class="modal-body">
                  <p>
                    Producto: <strong>{{ stockSeleccionado?.nombre }}</strong> - Color: <strong>{{
                      stockSeleccionado?.color }}</strong>
                  </p>
                  <div class="mb-3">
                    <label class="form-label">Cantidad:</label>
                    <input v-model.number="cantidadMovimiento" type="number" class="form-control" min="1">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Observación:</label>
                    <input v-model="observacion" type="text" class="form-control">
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-gris-a-blanco" @click="cerrarModal">
                    Cancelar
                  </button>
                  <button class="btn btn-rosa-a-blanco" @click="confirmarMovimiento">
                    Confirmar
                  </button>
                </div>
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
import { useToast } from 'vue-toastification'

const store = userStore()
const toast = useToast()

const mostrarCapacidadProduccion = ref(true)
const mostrarEmbalaje = ref(true)


const datoAFiltar = ref('')
const paginaActual = ref(1)
const paginasTotales = ref(10)
const totalPorpagina = ref(10)

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
      totalPorpagina.value,
      datoAFiltar.value
    );

    listaStock.value = respuesta.resultados;
    paginasTotales.value = respuesta.paginasTotales;
    listaStock.value.sort((a, b) =>
      a.tipoProducto.localeCompare(b.tipoProducto, 'es', { sensitivity: 'base' }))

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
    toast.success('Movimiento Registrado!')
    await traerStock() // refresca la lista
    cerrarModal() // cierra el modal
  } catch (error) {
    console.error('Error al crear movimiento:', error)
    toast.error('No se guardó el movimiento')
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

//Paginación:
const cambiarPagina = (newPage: number) => {

  if (newPage < 1 || newPage > paginasTotales.value) return;

  paginaActual.value = newPage;

  traerStock()

}

//Cambiar la cantidad por página:
const cambiarCantidadPorPagina = () => {
  paginaActual.value = 1
  traerStock()
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

/*centrar texto de tabla: */
.table-light th[colspan="3"] {
  background-color: #f3f3ff;
  font-weight: bold;
  border-bottom: 2px solid #dee2e6;
}

/* Aplica solo a los encabezados chicos */
th.th-subtitulo {
  font-size: 0.70rem;
  /* Más chico que el resto */
  line-height: 1.2;
  white-space: normal;
  /* Permite salto de línea automático */
  word-break: break-word;
  padding: 0.4rem 0.5rem;
  /* Menos padding = menos altura */
}

/*Destaco columna de stock final: */
.resaltar-celda {
  background-color: #f8f9fa;
  /* gris muy clarito */
  border-left: 2px solid #dee2e6;
  border-right: 2px solid #dee2e6;
}

.table thead th {

  font-size: 0.85rem;
  /* Tamaño de fuente un poco más chico */

}


/*Resto de los estilos están en archivo global styles.css*/
</style>