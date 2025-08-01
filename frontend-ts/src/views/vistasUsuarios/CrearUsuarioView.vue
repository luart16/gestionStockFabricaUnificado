<template>
  <div
    v-if="store.Logueado"
    class="contenido-app"
  >
    <div v-if="store.Rol == 'administrador'">
      <NavBar />

      <div class="container py-4">
        <div class="mb-4 text-center">
          <h1 class="titulo">
            Crear Usuario
          </h1>
          <p class="subtitulo subtitulo-1">
            Formulario para registrar un nuevo usuario.
          </p>
        </div>

        <div
          class="mx-auto"
          style="max-width: 400px;"
        >
          <form
            class="d-flex flex-column gap-3"
            @submit.prevent="crearUsuario"
          >
            <input
              v-model="usuarioACrear.nombreUsuario"
              type="text"
              placeholder="Nombre de usuario"
              required
              class="form-control"
            >
            <input
              v-model="usuarioACrear.email"
              type="email"
              placeholder="Email"
              required
              class="form-control"
            >
            <input
              v-model="usuarioACrear.contrasenia"
              type="password"
              placeholder="Contraseña"
              required
              class="form-control"
            >

            <!-- Etiqueta arriba del select -->
            <label
              for="rol"
              class="form-label mt-3"
            >Seleccione un rol</label>
            <select
              id="rol"
              v-model="usuarioACrear.rol"
              class="form-select"
            >
              <option
                disabled
                value=""
              >
                -- Elegir rol --
              </option>
              <option value="vendedor">
                Vendedor
              </option>
              <option value="encargado">
                Encargado
              </option>
            </select>


            <div class="d-flex flex-column flex-md-row gap-3 justify-content-center mt-3">
              <button
                type="submit"
                class="btn btn-rosa-a-blanco w-100"
              >
                Crear Usuario
              </button>
              <router-link
                to="/traerUsuarios"
                class="w-100"
              >
                <button
                  type="button"
                  class="btn btn-gris-a-blanco w-100"
                >
                  Volver
                </button>
              </router-link>
            </div>
          </form>
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
import RequiereLogin from '@/components/RequiereLogin.vue';
import NavBar from '@/components/BarraNavegacion.vue';
import RequiereRol from '@/components/RequiereRol.vue';
import { userStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { servicioUsuario } from '@/services/usuario.service';
import type { DatosUsuarios } from '@/modelos/usuario';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const store = userStore();
const router = useRouter();
const toast = useToast();

const usuarioACrear = ref<DatosUsuarios>({
  _id: '',
  nombreUsuario: '',
  email: '',
  contrasenia: '',
  rol: 'vendedor',
})

const crearUsuario = async () => {
  try {
    await servicioUsuario.crear(usuarioACrear.value)
    toast.success('Usuario Creado!')
    router.push({ name: 'traerUsuarios' });
  }
  catch (error) {
    console.error("Error creando usuario:", error)
    toast.error('Error al crear usuario')
  }
}

</script>

<style scoped>
.titulo {
  font-size: 36px;
  color: #ef5769;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}

.subtitulo {
  font-size: 20px;
  color: rgb(70, 40, 110);
  line-height: 1.5;
  margin: 0;
  font-family: 'Poppins', sans-serif;
}

.subtitulo-1 {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}

input::placeholder,
select::placeholder {
  color: #6c757d;
}
input:focus,
select:focus {
  border-color: #ef5769;
  box-shadow: 0 0 0 2px rgba(239, 87, 105, 0.2);
  outline: none;
}

/*Resto de los estilos están en archivo globar style.css */
</style>