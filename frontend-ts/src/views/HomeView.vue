<!-- <template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    
    
  </div>
</template> -->
<template>
  <div v-if="store.Logueado">
    <NavBar />
    <div class="container mt-5">
      <div class="row justify-content-center text-center">

        <div class="col-12 col-md-4 mb-4 d-flex justify-content-center">
          <div class="card h-100 shadow-sm card-hover" @click="irA('Piedra')" style="cursor: pointer;">
            <img src="@/imagenes/piedra.jpg" class="card-img-top imagen-ajustada" alt="Piedras">
            <div class="card-body">
              <h5 class="card-title">Piedras</h5>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4 mb-4 d-flex justify-content-center">
          <div class="card h-100 shadow-sm card-hover" @click="irA('Placa')" style="cursor: pointer;">
            <img src="@/imagenes/placa.jpg" class="card-img-top imagen-ajustada" alt="Placas">
            <div class="card-body">
              <h5 class="card-title">Placas</h5>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4 mb-4 d-flex justify-content-center">
          <div class="card h-100 shadow-sm card-hover" @click="irA('Piso')" style="cursor: pointer;">
            <img src="@/imagenes/piso.jpg" class="card-img-top imagen-ajustada" alt="Pisos">
            <div class="card-body">
              <h5 class="card-title">Pisos</h5>
            </div>
          </div>
        </div>

      </div>

      <div class="mt-4">
        <router-link to="/traerUsuarios">
          <button class="btn btn-primary m-2">Usuarios</button>
        </router-link>
        <router-link to="/traerSucursales">
          <button class="btn btn-primary m-2">Sucursales</button>
        </router-link>
        <router-link to="/traerTodosLosMateriales">
          <button class="btn btn-primary m-2">Materiales</button>
        </router-link>
        <router-link to="/historialMovimientosDeStock">
          <button class="btn btn-primary m-2">Listado de Movimientos de Stock</button>
        </router-link>
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
import { useRouter } from 'vue-router';

const store = userStore();
const router = useRouter();

const irA = (tipo: string) => {
  router.push(`/traerProductosPorTipo/${tipo}`);
}

</script>

<style scoped>
.card-hover {
  transition: transform 0.3s ease;
  max-width: 380px;
  width: 100%;
  margin: 0 auto;
}

.card-hover:hover {
  transform: scale(1.05);
}

.imagen-ajustada {
  height: 240px;
  object-fit: cover;
}

.btn-provisorio {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  background-color: #46286e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-provisorio:hover {
  background-color: #5a2d7a;
}
</style>