<template>
  <div v-if="store.Logueado" class="contenido-app">

    <div>
      <NavBar />

      <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 class="titulo">Usuarios</h1>
          <router-link v-if="store.Rol == 'administrador'" to="/crearUsuario">
            <button class="btn btn-gris-a-blanco">Crear nuevo usuario</button>
          </router-link>
        </div>

        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>Nombre Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th v-if="store.Rol == 'administrador'">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuariosExistentes" :key="usuario._id">
                <td>{{ usuario.nombreUsuario }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.rol }}</td>
                <td v-if="store.Rol == 'administrador'">
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      Opciones
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a class="dropdown-item" href="#" @click.prevent="activarModalEditar(usuario._id)">Editar</a>
                      </li>
                      <li>
                        <a class="dropdown-item text-danger" href="#"
                          @click.prevent="activarModalEliminar(usuario._id)">Eliminar</a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MODAL EDITAR USUARIO -->
        <div v-if="mostrarModalEditar" class="modal fade show d-block" tabindex="-1"
          style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Editar Usuario</h5>
                <button type="button" class="btn-close" @click="mostrarModalEditar = false"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="usuarioAEditar.nombreUsuario">
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="text" class="form-control" v-model="usuarioAEditar.email">
                </div>
                <div class="mb-3">
                  <label class="form-label">Rol</label>
                  <select v-model="usuarioAEditar.rol" class="form-select" required>
                    <option disabled value="">Seleccione una opción</option>
                    <option>administrador</option>
                    <option>vendedor</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input type="text" class="form-control" placeholder="Dejar vacío para no modificar"
                    v-model="usuarioAEditar.contrasenia">
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-gris-a-blanco" @click="mostrarModalEditar = false">Cancelar</button>
                <button class="btn btn-rosa-a-blanco" @click="editarUsuario">Guardar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL ELIMINAR USUARIO -->
        <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1"
          style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-content">

            <div class="modal-header">
              <h5 class="modal-title text-danger">¿Eliminar Usuario?</h5>
              <button type="button" class="btn-close" @click="mostrarModalEliminar = false"></button>
            </div>
            <div class="modal-body">
              <p>Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="mostrarModalEliminar = false">Cancelar</button>
              <button class="btn btn-danger" @click="eliminarUsuario">Eliminar</button>
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
import { servicioUsuario } from '@/services/usuario.service';
import type { DatosUsuarios } from '@/modelos/usuario';
import type { DatosUsuariosEditar } from '@/modelos/usuarioEditar';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const store = userStore();
const toast = useToast();

const idUsuarioAEditar = ref('');
const idUsuarioAEliminar = ref('');

const mostrarModalEditar = ref(false);
const mostrarModalEliminar = ref(false)

const usuarioAEditar = ref<DatosUsuariosEditar>({
  _id: '',
  nombreUsuario: '',
  email: '',
  contrasenia: '',
  rol: 'vendedor',
})

const usuariosExistentes = ref<DatosUsuarios[]>([]);

const traerTodos = async () => {
  try {
    const respuesta = await servicioUsuario.traerTodos();
    usuariosExistentes.value = respuesta;
  }
  catch (error) {
    console.error("Error al traer los usuarios:", error)

  }

}

const activarModalEditar = async (usuarioId: string) => {
  idUsuarioAEditar.value = usuarioId;
  mostrarModalEditar.value = true;
  usuarioAEditar.value = await servicioUsuario.traerUsuarioPorId(usuarioId)
  usuarioAEditar.value.contrasenia = "" //esto lo pongo para que no me muestre la clave que puso el usuario
}

const editarUsuario = async () => {
  try {

    const respuesta = await servicioUsuario.editar(idUsuarioAEditar.value, usuarioAEditar.value)
    console.log('Usuario editado con éxito.', respuesta)
    toast.success('Cambio Guardado!')
    traerTodos();
    mostrarModalEditar.value = false;
  }
  catch (error) {
    console.error("Error al editar usuario:", error)
    toast.error('Error al guardar los cambios')
  }
}

const activarModalEliminar = async (usuarioId: string) => {
  idUsuarioAEliminar.value = usuarioId;
  mostrarModalEliminar.value = true;
}

const eliminarUsuario = async () => {
  try {
    await servicioUsuario.eliminar(idUsuarioAEliminar.value);
    toast.success('Usuario Eliminado!')
    traerTodos();
    mostrarModalEliminar.value = false;
  }
  catch (error) {
    console.error("Error al eliminar usuario:", error)
    toast.error('Error al eliminar usuario')
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
.table thead th {
  line-height: 3;
}

/*Resto de los estilos están en archivo globar style.css */
</style>