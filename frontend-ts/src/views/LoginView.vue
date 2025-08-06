<template>
  <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="row shadow-lg rounded-5 overflow-hidden w-100" style="max-width: 920px;">
      <!-- LADO IZQUIERDO -->
      <div
        class="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5 bg-brand">
        <p class="fs-4 fw-semibold mb-3">
          Sistema de gestión de stock
        </p>

        <p class="text-light text-opacity-75 text-center px-3">
          Controlá productos, materiales y movimientos de forma rápida y eficiente.
        </p>
        <div class="mt-4">
          <i class="bi bi-box-seam fs-1 me-3" />
          <i class="bi bi-gear-fill fs-2 me-3" />
          <i class="bi bi-clipboard-check fs-2" />
        </div>
      </div>

      <!-- LADO DERECHO: LOGIN -->
      <div class="col-12 col-md-6 bg-white p-5">
        <h2 class="mb-4 text-center fw-bold text-dark">
          Iniciar sesión
        </h2>

        <form @submit.prevent="loguearse">
          <div class="mb-4">
            <div class="form-floating">
              <input id="email" v-model="email" type="email" class="form-control form-control-custom"
                placeholder="name@example.com" required>
              <label for="email"><i class="bi bi-envelope-fill me-2" />Correo electrónico</label>
            </div>
          </div>

          <div class="mb-4 position-relative">
            <div class="form-floating">
              <input id="password" v-model="contrasenia" :type="mostrarContrasenia ? 'text' : 'password'"
                class="form-control form-control-custom pe-5" placeholder="********" required>
              <label for="password"><i class="bi bi-lock-fill me-2" />Contraseña</label>
              <!-- Icono ojito -->
              <i :class="mostrarContrasenia ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
                class="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary" style="cursor: pointer;"
                @click="mostrarContrasenia = !mostrarContrasenia" />
            </div>
          </div>


          <button type="submit"
            class="btn btn-rosa-a-blanco w-100 py-2 fw-bold d-flex justify-content-center align-items-center"
            :disabled="cargando">
            <span v-if="!cargando"><!--Si está cargando se desactiva el botón para loguear-->
              Iniciar sesión
            </span>
            <span v-else class="d-flex align-items-center"><!--Mientras cargue me muestra la ruedita-->
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Cargando...
            </span>
          </button>

        </form>
        <!-- LOGO ABAJO DEL TODO -->
        <div class="text-center mt-5">
          <img src="@/imagenes/logoPirka.png" alt="Logo Pirka" style="width: 120px; max-width: 80%;">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { servicioLogin } from '@/services/login.service';
import { useRouter } from 'vue-router';
import { userStore } from '@/store/user';
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();
const store = userStore();

const cargando = ref(false);
const email = ref('');
const contrasenia = ref('');
const mostrarContrasenia = ref('')

const loguearse = async () => {
  cargando.value = true;
  try {
    const resultado = await servicioLogin.login(email.value, contrasenia.value);
    console.log(resultado)
    store.Loguear(resultado.nombreUsuario, resultado.rol);

    toast.success(`¡Bienvenid@, ${resultado.nombreUsuario}!`);
    router.push({ name: 'home' });
  } catch (error) {
    toast.error('Error al loguearse.');
    console.log(error);
  }
  finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";

.bg-brand {
  background: linear-gradient(135deg, #6d3ea3, #9d50bb);
  background-size: cover;
  background-position: center;
}

.btn-brand {
  background-color: #ef5769;
  color: white;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-brand:hover {
  background-color: #ff4f75;
}

.form-control-custom {
  border: none;
  border-radius: 0.75rem;
  background-color: #f5f5f5;
  padding-left: 1.2rem;
  color: #333;
}

.form-control-custom:focus {
  background-color: #fff;
  border-color: #ef5769;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 138, 0.25);
}

label {
  color: #666;
}

input::placeholder {
  color: #adb5bd;
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
</style>
