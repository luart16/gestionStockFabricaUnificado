<template>
  <div v-if="store.Logueado">
    <div v-if="store.Rol == 'administrador'">
      <NavBar />

      <div class="container py-4">
        <div class="mb-4 text-center">
          <h1 class="titulo">Crear Sucursal</h1>
          <p class="subtitulo subtitulo-1">Formulario para registrar una nueva sucursal.</p>
        </div>

        <div class="mx-auto" style="max-width: 400px;">
          <form @submit.prevent="crearSucursal" class="d-flex flex-column gap-3">
            <input v-model="sucursalACrear.nombreSucursal" type="text" placeholder="Nombre de sucursal" required class="form-control" />
            <input v-model="sucursalACrear.direccion" type="text" placeholder="Dirección" required class="form-control" />
            <input v-model="sucursalACrear.telefono" type="text" placeholder="Teléfono" required class="form-control" />

            <div class="d-flex flex-column flex-md-row gap-3 justify-content-center mt-3">
              <button type="submit" class="btn btn-rosa-a-blanco w-100">Crear Sucursal</button>
              <router-link to="/traerSucursales" class="w-100">
                <button type="button" class="btn btn-gris-a-blanco w-100">Volver</button>
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
import NavBar from '@/components/BarraNavegacion.vue'
import { userStore } from '@/store/user';
import { useRouter } from 'vue-router';
import RequiereRol from '@/components/RequiereRol.vue';
import { servicioSucursal } from '@/services/sucursal.service';
import type { DatosSucursales } from '@/modelos/sucursal';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const store = userStore();
const router = useRouter();
const toast = useToast();

const sucursalACrear = ref<DatosSucursales>({
  _id: '',
  nombreSucursal: '',
  direccion: '',
  telefono: '',
})


const crearSucursal = async () => {
  try {
    await servicioSucursal.crear(sucursalACrear.value)
toast.success('Sucursal Creada!')
    router.push({ name: 'traerSucursales' });
  }
  catch (error) {
    toast.error('Error al crear sucursal')
    console.error("Error creando sucursal:", error)
  }
}
</script>

<style scoped>
.titulo {
  font-size: 36px;
  color: #ef5769;
  font-weight: 600;
}

.subtitulo {
  font-size: 20px;
  color: rgb(70, 40, 110);
  line-height: 1.5;
  margin: 0;
}

.subtitulo-1 {
  font-weight: 600;
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

.btn-gris-a-blanco {
  background-color: #6c757d;
  border: 1px solid #6c757d;
  color: white;
  transition: all 0.3s ease;
}
.btn-gris-a-blanco:hover {
  background-color: white;
  color: #6c757d;
  border-color: #6c757d;
}

/* Estilo de input */
input::placeholder {
  color: #6c757d;
}
input:focus {
  border-color: #ef5769;
  box-shadow: 0 0 0 2px rgba(239, 87, 105, 0.2);
  outline: none;
}
</style>