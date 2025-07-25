<template>
  <div v-if="store.Logueado" class="contenido-app">
    
      <NavBar />

      <div class="container py-4">
       
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 class="titulo">Sucursales</h1>
          <router-link v-if="store.Rol == 'administrador'" to="/crearSucursal">
            <button class="btn btn-gris-a-blanco">Crear nueva sucursal</button>
          </router-link>
        </div>

        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>Nombre sucursal</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th v-if="store.Rol == 'administrador'">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sucursal in sucursalesExistentes" :key="sucursal._id">
                <td>{{ sucursal.nombreSucursal }}</td>
                <td>{{ sucursal.direccion }}</td>
                <td>{{ sucursal.telefono }}</td>
                <td v-if="store.Rol == 'administrador'">
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      Opciones
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a class="dropdown-item" href="#" @click.prevent="activarModalEditar(sucursal._id)">
                          Editar
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item text-danger" href="#"
                          @click.prevent="activarModalEliminar(sucursal._id)">
                          Eliminar
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MODAL EDITAR SUCURSAL -->
        <div v-if="mostrarModalEditar" class="modal fade show d-block" tabindex="-1"
          style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Editar Sucursal</h5>
                <button type="button" class="btn-close" @click="mostrarModalEditar = false"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="sucursalAEditar.nombreSucursal">
                </div>
                <div class="mb-3">
                  <label class="form-label">Dirección</label>
                  <input type="text" class="form-control" v-model="sucursalAEditar.direccion">
                </div>
                <div class="mb-3">
                  <label class="form-label">Teléfono</label>
                  <input type="text" class="form-control" v-model="sucursalAEditar.telefono">
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-gris-a-blanco" @click="mostrarModalEditar = false">Cancelar</button>
                <button class="btn btn-rosa-a-blanco" @click="editarSucursal">Guardar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL ELIMINAR SUCURSAL -->
        <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1"
          style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-danger">¿Eliminar Sucursal?</h5>
                <button type="button" class="btn-close" @click="mostrarModalEliminar = false"></button>
              </div>
              <div class="modal-body">
                <p>Esta acción no se puede deshacer.</p>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" @click="mostrarModalEliminar = false">Cancelar</button>
                <button class="btn btn-danger" @click="eliminarSucursal">Eliminar</button>
              </div>
            </div>
          </div>
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
import type { DatosSucursales } from '@/modelos/sucursal';
import { ref, onMounted } from 'vue';
import { servicioSucursal } from '@/services/sucursal.service';
import { DatosSucursalEditar } from '@/modelos/sucursalEditar';
import { useToast } from 'vue-toastification';

const store = userStore();
const toast = useToast();

const idSucursalAEditar = ref('');
const idSucursalAEliminar = ref('')
const mostrarModalEditar = ref(false);
const mostrarModalEliminar = ref(false)

const sucursalAEditar = ref<DatosSucursalEditar>({
  _id: '',
  nombreSucursal: '',
  direccion: '',
  telefono: '',
})

const sucursalesExistentes = ref<DatosSucursales[]>([]);

const traerTodos = async () => {
  try {
    const respuesta = await servicioSucursal.traerTodos();
    sucursalesExistentes.value = respuesta;
  }
  catch (error) {
    console.error("Error al traer las sucursales:", error)

  }

}

const activarModalEliminar = async (sucursalId: string) => {
  idSucursalAEliminar.value = sucursalId;
  mostrarModalEliminar.value = true;
}

const eliminarSucursal = async () => {
  try {
    await servicioSucursal.eliminar(idSucursalAEliminar.value);
    toast.success('Sucursal Eliminada')
    traerTodos();
    mostrarModalEliminar.value = false;
  }
  catch (error) {
    toast.error('Error al eliminar sucursal')
    console.error("Error al eliminar sucursal:", error)
  }
}

const activarModalEditar = async (sucursalId: string) => {
  idSucursalAEditar.value = sucursalId;
  mostrarModalEditar.value = true;
  sucursalAEditar.value = await servicioSucursal.traerSucursalPorId(sucursalId)

}

const editarSucursal = async () => {
  try {
    await servicioSucursal.editar(idSucursalAEditar.value, sucursalAEditar.value)
    toast.success('Cambio guardado')
    traerTodos();
    mostrarModalEditar.value = false;
  }
  catch (error) {
    toast.error('Error al guardar cambios')
    console.error("Error al editar sucursal:", error)
  }
}
onMounted(() => {
  traerTodos();
})

</script>

<style scoped>
.titulo {
  font-size: 36px;
  color: #ef5769;
  font-weight: 600;
}

.text-rosado {
  color: #ef5769 !important;
}

.table thead th {
  vertical-align: middle;
  text-align: center;
}

/* Alineación centrada de acciones */
td .dropdown {
  display: flex;
  justify-content: center;
}

/*Ato de las celdas cabeceras: */
.table thead th {line-height: 3; }

/*Resto de los estilos están en archivo globar style.css */
</style>