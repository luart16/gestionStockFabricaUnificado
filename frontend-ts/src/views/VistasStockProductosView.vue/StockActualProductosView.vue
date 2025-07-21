<template>
  <div v-if="store.Logueado">
    <div v-if="store.Rol == 'administrador'">
      <NavBar />
      <div class="container py-4">

        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 class="titulo">Stock Actual de Productos</h1>
          <router-link to="/historialMovimientosDeStock">
            <button class="btn btn-gris-a-blanco">Historial de Movimientos</button>
          </router-link>
        </div>

        <div class="d-flex mb-4 flex-wrap gap-3 align-items-end">

          <!-- Filtro -->
          <label class="form-label fw-semibold">Filtro:</label>
          <input type="text" v-model="datoAFiltar" class="form-control" placeholder="Buscar por tipo producto, nombre o color" style="max-width: 400px;" />

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
            <button class="btn btn-rosa-a-blanco" @click="exportarStockCompletoAExcel">Exportar Todo</button>
          </div>

        </div>

        <!-- Botones mostrar/ocultar -->
        <div class="d-flex align-items-end gap-2">
          <button class="btn btn-outline-secondary" @click="mostrarCapacidadProduccion = !mostrarCapacidadProduccion">
            {{ mostrarCapacidadProduccion ? 'Ocultar' : 'Mostrar' }} Capacidad de Producción
          </button>
          <button class="btn btn-outline-secondary" @click="mostrarEmbalaje = !mostrarEmbalaje">
            {{ mostrarEmbalaje ? 'Ocultar' : 'Mostrar' }} Embalaje
          </button>
        </div>

        <!--Tabla de stock:-->
        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th rowspan="2">Tipo Producto</th>
                <th rowspan="2">Producto</th>
                <th rowspan="2">Color</th>

                <th v-if="mostrarCapacidadProduccion" colspan="3" class="text-center">Capacidad de Producción</th>
                <th v-if="mostrarEmbalaje" colspan="3" class="text-center">Embalaje</th>

                <th rowspan="2">Stock Sin Comprometer</th>
                <th rowspan="2">Stock Comprometido</th>
                <th rowspan="2">Stock Final</th>
                <th rowspan="2">Acciones</th>
              </tr>
              <tr>
                <template v-if="mostrarCapacidadProduccion">
                  <th>Moldes</th>
                  <th>M2 por Molde</th>
                  <th>M2 totales</th>
                </template>
                <template v-if="mostrarEmbalaje">
                  <th>Unidades por paquete</th>
                  <th>M2 por paquete</th>
                  <th>Kg por paquete</th>
                </template>
              </tr>
            </thead>

            <!--cuerpo de la tabla:-->
            <tbody>
              <tr v-for="stock in listaStock" :key="stock._id">
                <td>{{ stock.tipoProducto }}</td>
                <td>{{ stock.nombre }}</td>
                <td>{{ stock.color }}</td>

                <td v-if="mostrarCapacidadProduccion">{{ stock.moldes }}</td>
                <td v-if="mostrarCapacidadProduccion">{{ stock.m2PorMolde }}</td>
                <td v-if="mostrarCapacidadProduccion">{{ stock.capacidadTotal }}</td>

                <td v-if="mostrarEmbalaje">{{ stock.unidadesPorPaquete }}</td>
                <td v-if="mostrarEmbalaje">{{ stock.m2PorPaquete }}</td>
                <td v-if="mostrarEmbalaje">{{ stock.kgPorPaquete }}</td>

                <td>{{ stock.stockSinCompromiso }}</td>
                <td>{{ stock.comprometido }}</td>
                <td>{{ stock.stockFinal }}</td>
                <td>
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
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
                          @click.prevent="abrirModal(stock, 'DESCOMPROMETIDO')">Descomprometer</a>
                      </li>
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
                <button class="btn btn-gris-a-blanco" @click="cerrarModal">Cancelar</button>
                <button class="btn btn-rosa-a-blanco" @click="confirmarMovimiento">Confirmar</button>
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
  color: #ef5769;
  font-weight: 600;
}

/*centrar texto de tabla: */
.table-light th[colspan="3"] {
  background-color: #f3f3ff;
  font-weight: bold;
  border-bottom: 2px solid #dee2e6;
}

/*Botón de historial de movimientos */
.btn-gris-a-blanco {
  background-color: #6c757d; /* color de btn-secondary de Bootstrap */
  border: 1px solid #6c757d;
  color: white;
  transition: all 0.3s ease;
}

.btn-gris-a-blanco:hover {
  background-color: white;
  color: #6c757d;
  border-color: #6c757d;
}

/*Botones para exportar a excel:*/
.btn-exportar-pagina {
  background-color: rgb(70, 40, 110);
  border: 1px solid rgb(70, 40, 110);
  color: white;
  transition: all 0.3s ease;
}

.btn-exportar-pagina:hover {
  background-color: white;
  color: rgb(70, 40, 110);
  border-color: rgb(70, 40, 110);
}

.btn-rosa-a-blanco {
  background-color: #ef5769;
  border: 1px solid #ef5769;
  color: white;
  transition: all 0.3s ease;
}

.btn-rosa-a-blanco:hover {
  background-color: white;
  color: #ef5769;  
  border-color: #ef5769;
}

/* Color de numeración paginación */
.pagination .page-link {
  color: rgb(70, 40, 110);
}

/* Paginación activa con fondo violeta y texto blanco */
.pagination .page-item.active .page-link {
  background-color: rgb(70, 40, 110);
  border-color: rgb(70, 40, 110);
  color: white;
}

/* Eliminar el borde celeste en la paginación */
.pagination .page-link:focus {
  outline: none;
  box-shadow: none;
}

</style>