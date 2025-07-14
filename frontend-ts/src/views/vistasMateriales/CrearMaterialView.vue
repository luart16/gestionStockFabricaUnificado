<template>
  <div v-if="store.Logueado">
    <div v-if="store.Rol == 'administrador'">
      <NavBar />
      <div class="container py-4">
        <div class="text-center mb-4">
          <h1 class="titulo">Crear Material</h1>
          <p class="subtitulo">Formulario para registrar un nuevo material.</p>
        </div>

        <div class="card shadow p-4 mx-auto" style="max-width: 500px;">
          <form @submit.prevent="crearMaterial">
            <div class="mb-3">
              <label class="form-label fw-semibold">Nombre del material:</label>
              <input v-model="materialACrear.nombreMaterial" type="text" class="form-control" placeholder="Nombre del material" required />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Color:</label>
              <input v-model="materialACrear.color" type="text" class="form-control" placeholder="Color" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Descripción:</label>
              <input v-model="materialACrear.descripcion" type="text" class="form-control" placeholder="Descripción del material" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Precio:</label>
              <input v-model="materialACrear.precio" type="number" class="form-control" placeholder="Precio" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Stock:</label>
              <input v-model="materialACrear.stock" type="number" class="form-control" placeholder="Precio" />
            </div>

            <div class="d-flex gap-2 justify-content-end">
              <button type="submit" class="btn-rosa">Crear Material</button>
              <router-link to="/GestionarMateriales">
                <button type="button" class="btn btn-secondary">Volver</button>
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
    toast.success('Material creado con éxito.')
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
  }
}


</script>

<style scoped>
.titulo {
  font-size: 36px;
  color: #ff6b8a;
  font-weight: 600;
}

.subtitulo {
  font-size: 18px;
  color: rgb(70, 40, 110);
}

.btn-rosa {
  background-color: #ff6b8a;
  color: white;
  border: none;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color 0.2s ease;
}

.btn-rosa:hover {
  background-color: #e05576;
}
</style>
