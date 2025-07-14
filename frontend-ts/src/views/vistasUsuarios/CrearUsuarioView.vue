<template>
  <div v-if="store.Logueado">
    <div v-if="store.Rol == 'administrador'">
      <NavBar />
      <div class="login-container">
        <div class="presentacion">
          <h1 class="titulo">Crear Usuario</h1>
          <p class="subtitulo subtitulo-1">Formulario para registrar un nuevo usuario.</p>
        </div>

        <div class="login-box">
          <form @submit.prevent="crearUsuario">
            <input v-model="usuarioACrear.nombreUsuario" type="text" placeholder="Nombre de usuario" required />
            <input v-model="usuarioACrear.email" type="email" placeholder="Email" required />
            <input v-model="usuarioACrear.contrasenia" type="password" placeholder="Contraseña" required />
            <select v-model="usuarioACrear.rol" required>
              <option disabled value="">Selecciona un rol</option>
              <option value="encargado">Encargado</option>
              <option value="vendedor">Vendedor</option>
            </select>
            <button type="submit" class="btn-principal">Crear Usuario</button>
             <router-link to="/traerUsuarios">
              <button class="btn-principal">Volver</button>
            </router-link>
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

const store = userStore();
const router = useRouter();

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
    router.push({ name: 'traerUsuarios' });
  }
  catch (error) {
    console.error("Error creando usuario:", error)
  }
}
/*ATENCIÓN:    **************los usuarios sólo debe poder crearlos el administrador!!!*/

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

.subtitulo-2 {
  font-weight: 400;
}

.login-box {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 350px;
  border: 1px solid #e9ecef;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input,
select {
  padding: 15px;
  font-size: 16px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  outline: none;
  background-color: #ffffff;
  color: #495057;
}

input::placeholder,
select::placeholder {
  color: #6c757d;
}

input:focus,
select:focus {
  border-color: #ff6b8a;
  box-shadow: 0 0 0 2px rgba(255, 107, 138, 0.1);
}

.btn-principal {
  background-color: rgba(70, 40, 110, 1);
  color: white;
  border: none;
  padding: 15px;
  font-size: 14px;
  font-weight: bolder;
  border-radius: 4px;
  cursor: pointer;
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
    max-width: 350px;
  }
}
</style>
