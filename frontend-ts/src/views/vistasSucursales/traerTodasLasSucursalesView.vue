<template>
  <div v-if="store.Logueado">
    <NavBar />
    <div class="login-container">
      <div class="presentacion">
        <h1 class="titulo">Sucursales</h1>
        <p class="subtitulo subtitulo-1">Listado de sucursales registradas en el sistema.</p>
      </div>

      <div class="login-box">
        <table class="tabla-estado">
          <thead>
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
                <button @click="editarSucursal(sucursal._id)" class="btn-principal">Editar</button>
                <button @click="eliminarSucursal(sucursal._id)" class="btn-principal">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <router-link to="/crearSucursal">
          <button class="btn-principal" style="margin-top: 20px;">Crear nueva sucursal</button>
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
import type { DatosSucursales } from '@/modelos/sucursal';
import { ref, onMounted } from 'vue';
import { servicioSucursal } from '@/services/sucursal.service';

const store = userStore();

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

const eliminarSucursal = async (sucursalId: string) => {
    try {
        await servicioSucursal.eliminar(sucursalId);
        traerTodos();
    }
    catch (error) {
        console.error("Error al eliminar sucursal:", error)
    }
}
const editarSucursal = async (sucursalId: string) => {
    try {

        //completarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr

    }
    catch (error) {
        console.error("Error al editar sucursal:", error)
    }
}
onMounted(() => {
    traerTodos();
})

</script>

<style scoped>
* {
  font-family: Poppins;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
  gap: 60px;
  padding: 20px;
  flex-wrap: wrap;
}

.presentacion {
  max-width: clamp(400px, 60%, 700px);
  text-align: center;
}

.titulo {
  font-size: 48px;
  color: #ff6b8a;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.subtitulo {
  font-size: 30px;
  color: rgb(70, 40, 110);
  line-height: 1.5;
  margin: 0;
}

.subtitulo-1 {
  font-weight: 600;
}

.login-box {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: clamp(300px, 90%, 900px);
  border: 1px solid #e9ecef;
  overflow-x: auto;
}

.tabla-estado {
  width: 100%;
  border-collapse: collapse;
}

.tabla-estado th,
.tabla-estado td {
  padding: 12px;
  border: 1px solid #dee2e6;
  text-align: left;
}

.tabla-estado th {
  background-color: #f8f9fa;
  color: #333;
}

.btn-principal {
  background-color: rgba(70, 40, 110, 1);
  color: white;
  border: none;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: bolder;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  transition: background-color 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-principal:hover {
  background-color: #5a2d7a;
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    gap: 40px;
  }

  .presentacion {
    text-align: center;
    max-width: 100%;
  }

  .titulo {
    font-size: 36px;
  }

  .login-box {
    width: 100%;
    max-width: 100%;
  }
}
</style>