<template>
  <div v-if="store.Logueado" class="contenido-app">
    <div v-if="store.Rol == 'administrador'">
      <NavBar />

      <div class="container py-4" style="max-width: 1200px; padding-left: 20px; padding-right: 20px; margin: 0 auto;">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 class="titulo">
            Productos
          </h1>
          <router-link to="/crearProducto">
            <button class="btn btn-gris-a-blanco">
              Crear Nuevo Producto
            </button>
          </router-link>
        </div>


        <!-- Filtro -->
        <div class="d-flex mb-4 flex-wrap gap-3 align-items-end">
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
        </div>
        <div v-if="productosExistentes.length == 0">
          <p class="subtitulo-1 m-0 ">
            No hay datos disponibles para mostrar
          </p>
        </div>

        <div v-else>
          <!-- Tabla para vista en computadora -->
          <div class="table-responsive d-none d-md-block">
            <table class="table table-hover table-bordered align-middle">
              <thead class="table-light">
                <tr>
                  <th>Tipo Producto</th>
                  <th>Nombre</th>
                  <th>Color</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Moldes</th>
                  <th>M2<br>por<br>Molde</th>
                  <th>M2<br>totales</th>
                  <th>Unidades<br>por<br>paquete</th>
                  <th>M2<br>por<br>paquete</th>
                  <th>Kg<br>por<br>paquete</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="producto in productosExistentes" :key="producto._id">
                  <td>{{ producto.tipoProducto }}</td>
                  <td>{{ producto.nombre }}</td>
                  <td>{{ producto.color }}</td>
                  <td>{{ producto.descripcion }}</td>
                  <td>{{ producto.precio }}</td>
                  <td>{{ producto.moldes }}</td>
                  <td>{{ Number(producto.m2PorMolde || 0).toFixed(2) }}</td>
                  <td>{{ Number(producto.capacidadTotal || 0).toFixed(2) }}</td>

                  <td>{{ producto.unidadesPorPaquete }}</td>
                  <td>{{ producto.m2PorPaquete }}</td>
                  <td>{{ producto.kgPorPaquete }}</td>
                  <td>
                    <div class="dropdown">
                      <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Opciones
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#"
                            @click.prevent="activarModalEditarProducto(producto._id)">Editar</a>
                        </li>
                        <li>
                          <a class="dropdown-item text-danger" href="#"
                            @click.prevent="activarModalEliminarrProducto(producto._id)">Eliminar</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cards para vista en móviles -->
        <div class="d-md-none">
          <div v-for="producto in productosExistentes" :key="'card-' + producto._id" class="card mb-3">
            <div class="card-body">
              <h5 class="card-title mb-2">{{ producto.nombre }} ({{ producto.tipoProducto }})</h5>
              <p class="card-text mb-1"><strong>Color:</strong> {{ producto.color }}</p>
              <p class="card-text mb-1"><strong>Descripción:</strong> {{ producto.descripcion }}</p>
              <p class="card-text mb-1"><strong>Precio:</strong> {{ producto.precio }}</p>
              <p class="card-text mb-1"><strong>Moldes:</strong> {{ producto.moldes }}</p>
              <p class="card-text mb-1"><strong>M² por Molde:</strong> {{ Number(producto.m2PorMolde || 0).toFixed(2) }}
              </p>
              <p class="card-text mb-1"><strong>M² totales:</strong> {{ Number(producto.capacidadTotal || 0).toFixed(2)
                }}</p>

              <p class="card-text mb-1"><strong>Unidades por paquete:</strong> {{ producto.unidadesPorPaquete }}</p>
              <p class="card-text mb-1"><strong>M² por paquete:</strong> {{ producto.m2PorPaquete }}</p>
              <p class="card-text mb-1"><strong>Kg por paquete:</strong> {{ producto.kgPorPaquete }}</p>

              <div class="mt-3">
                <button class="btn btn-outline-secondary me-2" @click="activarModalEditarProducto(producto._id)">
                  Editar
                </button>
                <button class="btn btn-danger" @click="activarModalEliminarrProducto(producto._id)">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL EDITAR PRODUCTO -->
        <div v-if="mostrarModalEditar" class="modal fade show d-block" tabindex="-1"
          style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  Editar Producto
                </h5>
                <button type="button" class="btn-close" @click="mostrarModalEditar = false" />
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Tipo de Producto</label>
                  <select v-model="productoAEditar.tipoProducto" class="form-select">
                    <option>Piedra</option>
                    <option>Placa</option>
                    <option>Piso</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input v-model="productoAEditar.nombre" type="text" class="form-control"
                    @input="productoAEditar.nombre = productoAEditar.nombre.toUpperCase()">
                </div>

                <div class="mb-3">
                  <label class="form-label">Color</label>
                  <input v-model="productoAEditar.color" type="text" class="form-control"
                    @input="productoAEditar.color = productoAEditar.color.toUpperCase()">
                </div>

                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <input v-model="productoAEditar.descripcion" type="text" class="form-control">
                </div>

                <div class="mb-3">
                  <label class="form-label">Precio</label>
                  <input v-model="productoAEditar.precio" type="number" step="0.01" class="form-control">
                </div>

                <h6 class="fw-bold mt-3">
                  Capacidad de Producción
                </h6>
                <div class="mb-3">
                  <label class="form-label">Cantidad de Moldes</label>
                  <input v-model="productoAEditar.moldes" type="number" class="form-control">
                </div>

                <div class="mb-3">
                  <label class="form-label">M² por Molde</label>
                  <input v-model="productoAEditar.m2PorMolde" type="number" step="0.01" class="form-control">
                </div>

                <h6 class="fw-bold mt-3">
                  Embalaje
                </h6>
                <div class="mb-3">
                  <label class="form-label">Unidades por Paquete</label>
                  <input v-model="productoAEditar.unidadesPorPaquete" type="number" class="form-control">
                </div>

                <div class="mb-3">
                  <label class="form-label">M² por Paquete</label>
                  <input v-model="productoAEditar.m2PorPaquete" type="number" step="0.01" class="form-control">
                </div>

                <div class="mb-3">
                  <label class="form-label">Kg por Paquete</label>
                  <input v-model="productoAEditar.kgPorPaquete" type="number" step="0.01" class="form-control">
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-gris-a-blanco" @click="mostrarModalEditar = false">
                  Cancelar
                </button>
                <button class="btn btn-rosa-a-blanco" @click="mostrarModalConfirmarEdicion = true">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL CONFIRMAR GUARDAR CAMBIOS -->
        <div v-if="mostrarModalConfirmarEdicion" class="modal fade show d-block" tabindex="-1"
          style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-rosado">
                  ¿Desea guardar los cambios?
                </h5>
                <button type="button" class="btn-close" @click="mostrarModalConfirmarEdicion = false" />
              </div>
              <div class="modal-body">
                <p>Se sobrescribirá la información del producto.</p>
              </div>
              <div class="modal-footer">
                <button class="btn btn-gris-a-blanco" @click="mostrarModalConfirmarEdicion = false">
                  No
                </button>
                <button class="btn btn-rosa-a-blanco" @click="confirmarEdicion">
                  Sí, guardar
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- MODAL ELIMINAR PRODUCTO -->
        <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1"
          style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-danger">
                  ¿Eliminar Producto?
                </h5>
                <button type="button" class="btn-close" @click="mostrarModalEliminar = false" />
              </div>
              <div class="modal-body">
                <p>Esta acción no se puede deshacer.</p>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" @click="mostrarModalEliminar = false">
                  Cancelar
                </button>
                <button class="btn btn-danger" @click="eliminarProducto">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
          <!--Paginación-->
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
        </div>

        <!-- Paginación -->
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
import RequiereLogin from '@/components/RequiereLogin.vue';
import RequiereRol from '@/components/RequiereRol.vue';
import NavBar from '@/components/BarraNavegacion.vue'
import { userStore } from '@/store/user';
import type { DatosProductos } from '@/modelos/producto';
import { ref, onMounted, watch } from 'vue';
import { servicioProducto } from '@/services/producto.service';
import type { DatosProductosEditar } from '@/modelos/productoEditar';
import { useToast } from 'vue-toastification';

const store = userStore();
const toast = useToast();

const idProductoAEditar = ref('');
const idProductoAEliminar = ref('');

const mostrarModalEditar = ref(false);
const mostrarModalEliminar = ref(false)

const mostrarModalConfirmarEdicion = ref(false)

const datoAFiltar = ref('')
const paginaActual = ref(1)
const paginasTotales = ref(10)
const totalPorpagina = ref(10)

const productoAEditar = ref<DatosProductosEditar>({
  _id: '',
  tipoProducto: 'Piedra',
  nombre: 'Ekos',
  color: 'Gris',
  descripcion: 'Piedra ecológica',
  precio: 5520,
  m2PorMolde: 0,
  capacidadTotal: 0,
  unidadesPorPaquete: 0,
  m2PorPaquete: 0,
  kgPorPaquete: 0,
  moldes: 0,
})

const productosExistentes = ref<DatosProductos[]>([]);

const traerTodos = async () => {
  try {
    const respuesta = await servicioProducto.traerTodos(
      paginaActual.value,
      totalPorpagina.value,
      datoAFiltar.value
    );

    productosExistentes.value = respuesta.resultados;
    paginasTotales.value = respuesta.paginasTotales;
    productosExistentes.value.sort(((a, b) =>
      a.tipoProducto.localeCompare(b.tipoProducto, 'es', { sensitivity: 'base' })))
    console.log(respuesta)
  }
  catch (error) {
    console.error("Error al traer los productos:", error)
  }
}

const activarModalEliminarrProducto = async (productoId: string) => {
  idProductoAEliminar.value = productoId;
  mostrarModalEliminar.value = true;
}

const eliminarProducto = async () => {
  try {
    await servicioProducto.eliminar(idProductoAEliminar.value);
    mostrarModalEliminar.value = false;
    toast.success('Producto Eliminado!')
    traerTodos();
  }
  catch (error) {
    console.error("Error al eliminar producto:", error)
    toast.error('No se pudo eliminar el producto.')
  }
}

const activarModalEditarProducto = async (productoId: string) => {
  idProductoAEditar.value = productoId;
  mostrarModalEditar.value = true;
  productoAEditar.value = await servicioProducto.traerProductoPorId(productoId)
}

const confirmarEdicion = async () => {
  try {
    await servicioProducto.editar(idProductoAEditar.value, productoAEditar.value);
    toast.success('Cambio Guardado!');
    mostrarModalConfirmarEdicion.value = false;
    mostrarModalEditar.value = false;
    traerTodos();
  } catch (error) {
    console.error("Error al modificar producto:", error);
    toast.error('No se pudo editar el producto.');
  }
};

const cambiarPagina = (newPage: number) => {
  if (newPage < 1 || newPage > paginasTotales.value) return;
  paginaActual.value = newPage;
  traerTodos()
}

//Cambiar la cantidad por página:
const cambiarCantidadPorPagina = () => {
  paginaActual.value = 1
  traerTodos()
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
  traerTodos()
}, 500) // 500 ms de espera

// Watch que llama traerStockDebounce al escribir
watch(datoAFiltar, () => {
  traerStockDebounce()
})


onMounted(() => {
  traerTodos();
})

</script>

<style scoped>

.titulo {
  font-size: 36px;
  color: rgb(70, 40, 110);
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}

.text-rosado {
  color: #ef5769 !important;
}

.table thead th {

  font-size: 0.85rem;
  /* Tamaño de fuente un poco más chico */

}

/*Resto de los estilos están en archivo globar style.css */
</style>