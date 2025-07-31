<template>
  <div
    v-if="store.Logueado"
    class="contenido-app"
  >
    <div v-if="store.Rol == 'administrador'">
      <NavBar />
      <div class="container py-4">
        <div class="text-center mb-4">
          <h1 class="titulo">
            Crear Material
          </h1>
          <p class="subtitulo">
            Formulario para registrar un nuevo material.
          </p>
        </div>

        <div
          class="card shadow p-4 mx-auto"
          style="max-width: 500px;"
        >
          <form @submit.prevent="crearMaterial">
            <div class="mb-3">
              <label class="form-label fw-semibold">Nombre del material:</label>
              <input
                v-model="materialACrear.nombreMaterial"
                type="text"
                class="form-control"
                placeholder="Nombre del material"
                required
                @input="materialACrear.nombreMaterial = materialACrear.nombreMaterial.toUpperCase()"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Color:</label>
              <input
                v-model="materialACrear.color"
                type="text"
                class="form-control"
                placeholder="Color"
                @input="materialACrear.color = materialACrear.color.toUpperCase()"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Descripción:</label>
              <input
                v-model="materialACrear.descripcion"
                type="text"
                class="form-control"
                placeholder="Descripción del material"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Precio:</label>
              <input
                v-model="materialACrear.precio"
                type="number"
                step="0.01"
                class="form-control"
                placeholder="Precio"
              >
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Stock:</label>
              <input
                v-model="materialACrear.stock"
                type="number"
                step="0.01"
                class="form-control"
                placeholder="Precio"
              >
            </div>

            <div class="d-flex gap-2 justify-content-end">
              <button
                type="submit"
                class="btn btn-rosa-a-blanco"
              >
                Crear Material
              </button>
              <router-link to="/GestionarMateriales">
                <button
                  type="button"
                  class="btn btn-gris-a-blanco"
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
import NavBar from '@/components/BarraNavegacion.vue'
import { useToast } from 'vue-toastification';
import { userStore } from '@/store/user';
import { useRouter } from 'vue-router';
import RequiereRol from '@/components/RequiereRol.vue';
import { servicioMaterial } from '@/services/material.service';
import type { DatosMateriales } from '@/modelos/material';
import { ref } from 'vue';

const store = userStore();
const toast = useToast();
const router = useRouter();


const materialACrear = ref<DatosMateriales>({
  _id: '',
  nombreMaterial: '',
  color: '',
  descripcion: '',
  precio: 0,
  stock: 0,
})


const crearMaterial = async () => {
  try {
    await servicioMaterial.crear(materialACrear.value);
    toast.success('Material Creado!')
    router.push({ name: 'gestionarMateriales' }); 

    // Limpio el formulario reseteando el objeto:
    materialACrear.value = {
       _id: '',
  nombreMaterial: '',
  color: '',
  descripcion: '',
  precio: 0,
  stock: 0,
    }
  }
  catch (error) {
    console.error("Error creando material:", error)
    toast.error('Error al crear el material')
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
  font-size: 18px;
  color: rgb(70, 40, 110);
}

/*Para el borde rosa del input: */
input:focus,
select:focus {
  border-color: #ef5769;
  box-shadow: 0 0 0 2px rgba(239, 87, 105, 0.2);
  outline: none;
}
input::placeholder,
select::placeholder {
  color: #6c757d;
}

/*Resto de los estilos están en archivo globar style.css */

</style>
