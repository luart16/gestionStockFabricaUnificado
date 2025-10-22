<template>
  <div v-if="store.Logueado" class="contenido-app">
    <NavBar />

    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 class="titulo">Materiales </h1>
        </div>
        <router-link v-if="store.Rol == 'administrador'" to="/crearMaterial">
          <button class="btn btn-gris-a-blanco">Crear Nuevo Material</button>
        </router-link>
      </div>


      <!-- Filtro -->
      <div class="d-flex mb-4 flex-wrap gap-3 align-items-end">

        <label class="form-label fw-semibold">Filtro:</label>
        <input type="text" v-model="datoAFiltar" class="form-control" placeholder="Buscar por nombre o color"
          style="max-width: 400px;" />

        <!-- Selector de cantidad por página -->
        <div class="d-flex align-items-end">
          <label class="form-label me-2">Mostrar:</label>
          <select class="form-select" style="width: auto;" v-model="totalPorpagina" @change="cambiarCantidadPorPagina">
            <option :value="10">10 por página</option>
            <option :value="20">20 por página</option>
            <option :value="50">50 por página</option>
          </select>
        </div>

      </div>

      <div v-if="materialesExistentes.length == 0">
        <p class="subtitulo-1 m-0 ">No hay datos disponibles para mostrar</p>
      </div>
      <div v-else>

        <!-- Tabla Materiales para vista de computadora-->
        <div class="table-responsive d-none d-md-block">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>Nombre de Material</th>
                <th>Color</th>
                <th>Descripción</th>
                <th>Precio ($)</th>
                <th>Stock (x Unidad)</th>
                <th v-if="store.Rol == 'administrador'">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="material in materialesExistentes" :key="material._id">
                <td>{{ material.nombreMaterial }}</td>
                <td>{{ material.color }}</td>
                <td>{{ material.descripcion }}</td>
                <td>{{ material.precio }}</td>
                <td>{{ material.stock }}</td>
                <td v-if="store.Rol == 'administrador'">
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      Opciones
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#"
                          @click.prevent="activarModalEditarMaterial(material._id)">Editar</a></li>
                      <li><a class="dropdown-item text-danger" href="#"
                          @click.prevent="activarModalEliminarrMaterial(material._id)">Eliminar</a></li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

         <!-- Vista tipo tarjeta para pantallas de celular -->
        <div class="d-md-none">
          <div
            v-for="material in materialesExistentes"
            :key="'card-' + material._id"
            class="card mb-3"
          >
            <div class="card-body">
              <h5 class="card-title mb-2">{{ material.nombreMaterial }} ({{ material.color }})</h5>
              <p class="card-text mb-1"><strong>Descripción:</strong> {{ material.descripcion }}</p>
              <p class="card-text mb-1"><strong>Precio en $:</strong> {{ material.precio }}</p>
              <p class="card-text mb-1"><strong>Stock en Unidades:</strong> {{ material.stock }}</p>

              <!-- Mostrar botones solo si es admin -->
              <div v-if="store.Rol == 'administrador'" class="mt-2">
                <button class="btn btn-outline-secondary me-2" @click="activarModalEditarMaterial(material._id)">Editar</button>
                <button class="btn btn-danger" @click="activarModalEliminarrMaterial(material._id)">Eliminar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL EDITAR MATERIAL -->
        <div v-if="mostrarModalEditar" class="modal fade show d-block" tabindex="-1"
          style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Editar Material</h5>
                <button type="button" class="btn-close" @click="mostrarModalEditar = false"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="materialAEditar.nombreMaterial"
                    @input="materialAEditar.nombreMaterial = materialAEditar.nombreMaterial.toUpperCase()">
                </div>
                <div class="mb-3">
                  <label class="form-label">Color</label>
                  <input type="text" class="form-control" v-model="materialAEditar.color"
                    @input="materialAEditar.color = materialAEditar.color.toUpperCase()">
                </div>
                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <input type="text" class="form-control" v-model="materialAEditar.descripcion">
                </div>
                <div class="mb-3">
                  <label class="form-label">Precio en $</label>
                  <input type="number" step="0.01" class="form-control" v-model="materialAEditar.precio">
                </div>
                <div class="mb-3">
                  <label class="form-label">Stock en Unidades</label>
                  <input type="number" step="0.01" class="form-control" v-model="materialAEditar.stock">
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-gris-a-blanco" @click="mostrarModalEditar = false">Cancelar</button>
                <button class="btn btn-rosa-a-blanco" @click="mostrarModalConfirmarEdicion = true">Guardar</button>
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
                <h5 class="modal-title text-rosado">¿Desea guardar los cambios?</h5>
                <button type="button" class="btn-close" @click="mostrarModalConfirmarEdicion = false"></button>
              </div>
              <div class="modal-body">
                <p>Se sobrescribirá la información del producto.</p>
              </div>
              <div class="modal-footer">
                <button class="btn btn-gris-a-blanco" @click="mostrarModalConfirmarEdicion = false">No</button>
                <button class="btn btn-rosa-a-blanco" @click="confirmarEdicion">Sí, guardar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL ELIMINAR MATERIAL -->
        <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1"
          style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-danger">¿Eliminar Material?</h5>
                <button type="button" class="btn-close" @click="mostrarModalEliminar = false"></button>
              </div>
              <div class="modal-body">
                <p>Esta acción no se puede deshacer.</p>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" @click="mostrarModalEliminar = false">Cancelar</button>
                <button class="btn btn-danger" @click="eliminarMaterial">Eliminar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación -->
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
      </div>
    </div>
  </div>

  <div v-else>
    <RequiereLogin />
  </div>
</template>

<script setup lang="ts">
import RequiereLogin from '@/components/RequiereLogin.vue';
import NavBar from '@/components/BarraNavegacion.vue'
import { userStore } from '@/store/user';
import { useToast } from 'vue-toastification';
import type { DatosMateriales } from '@/modelos/material';
import { ref, onMounted, watch } from 'vue';
import { servicioMaterial } from '@/services/material.service';
import type { DatosMaterialesEditar } from '@/modelos/materialEditar';

const store = userStore();
const toast = useToast();

const idMaterialAEditar = ref('');
const idMaterialAEliminar = ref('');

const mostrarModalEditar = ref(false);
const mostrarModalEliminar = ref(false)

const mostrarModalConfirmarEdicion = ref(false)

const datoAFiltar = ref('')
const paginaActual = ref(1)
const paginasTotales = ref(10)
const totalPorpagina = ref(10)

const materialAEditar = ref<DatosMaterialesEditar>({
  _id: '',
  nombreMaterial: 'Pegamento',
  color: 'Gris',
  descripcion: 'Bolsa de 2kg',
  precio: 5520,
  stock: 0,
})

const materialesExistentes = ref<DatosMateriales[]>([]);

const traerTodos = async () => {
  try {
    const respuesta = await servicioMaterial.traerTodos(paginaActual.value,
      totalPorpagina.value,
      datoAFiltar.value);

    materialesExistentes.value = respuesta.resultados;
    paginasTotales.value = respuesta.paginasTotales;
    materialesExistentes.value.sort((a, b) =>
      a.nombreMaterial.localeCompare(b.nombreMaterial, 'es', { sensitivity: 'base' }))
  }
  catch (error) {
    console.error("Error al traer los materiales:", error)
  }
}

const activarModalEliminarrMaterial = async (materialId: string) => {
  idMaterialAEliminar.value = materialId;
  mostrarModalEliminar.value = true;
}

const eliminarMaterial = async () => {
  try {
    await servicioMaterial.eliminar(idMaterialAEliminar.value);
    mostrarModalEliminar.value = false;
    toast.success('Material Eliminado!');
    traerTodos();
  }
  catch (error) {
    console.error("Error al eliminar Material:", error)
    toast.error('No se pudo eliminar el material.')
  }
}

const activarModalEditarMaterial = async (materialId: string) => {
  idMaterialAEditar.value = materialId;
  mostrarModalEditar.value = true;
  materialAEditar.value = await servicioMaterial.traerMaterialPorId(materialId)
}

const confirmarEdicion = async () => {
  try {
    const respuesta = await servicioMaterial.editar(idMaterialAEditar.value, materialAEditar.value)
    console.log('Material editado con éxito.', respuesta)
    toast.success('Cambio Guardado!');
    mostrarModalConfirmarEdicion.value = false;
    mostrarModalEditar.value = false;
    traerTodos();
  }
  catch (error) {
    console.error("Error al modificar Material:", error);
    toast.error('No se pudo editar el material.');
  }
}
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

// Versión con debounce 
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

/*Resto de los estilos están en archivo globar style.css */


.table thead th {
  line-height: 3;
}
</style>