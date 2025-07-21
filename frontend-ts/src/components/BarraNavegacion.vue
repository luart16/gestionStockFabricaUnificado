<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom py-3">
    <div class="container">
      <router-link to="/home" class="navbar-brand" @click="cerrarMenu">
        <img src="@/imagenes/logoPirka.png" alt="Logo Pirka" class="logo-img" />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        @click="cambiarEstadoMenu"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent" ref="elementoMenu">
        <div class="navbar-nav ms-auto align-items-center gap-3">
          <router-link to="/home" class="nav-link" @click="cerrarMenu">Inicio</router-link>
          <router-link v-if="store.Rol == 'administrador'" to="/gestionarProductos" class="nav-link" @click="cerrarMenu">Gestionar Productos</router-link>
          <router-link v-if="store.Rol == 'administrador'" to="/gestionarMateriales" class="nav-link" @click="cerrarMenu">Gestionar Materiales</router-link>
          <router-link v-if="store.Rol == 'administrador'" to="/stockActualDeProductos" class="nav-link" @click="cerrarMenu">Gestionar Stock</router-link>
          <button class="btn btn-principal" @click="deslogueo">Desloguear</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Collapse } from 'bootstrap';
import { userStore } from '@/store/user';
import { useRouter } from 'vue-router';

const store = userStore();
const router = useRouter();

//para que el menú hamburguesa se pueda abrir y cerrar:
const elementoMenu = ref(null);
let menuDesplegable = null;

const cambiarEstadoMenu = () => {
  if (menuDesplegable) {
    menuDesplegable.toggle();
  }
};

const cerrarMenu = () => {
  if (menuDesplegable) {
    menuDesplegable.hide();
  }
};

const deslogueo = () => {
  store.Deslogueo();
  router.push({ name: 'login' });
  cerrarMenu();
};

onMounted(() => {
  if (elementoMenu.value) {
    menuDesplegable = new Collapse(elementoMenu.value, { toggle: false });
  }
});
</script>

<style scoped>
* {
  font-family: Poppins;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

/* Estilos para el botón desloguear - personalizado */
.btn-principal {
  background-color: #ff6b8a;
  color: white;
  border: 1px solid #ff6b8a;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bolder;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-principal:hover {
    background-color: white;
  color: #ff6b8a;  
  border-color: #ff6b8a;
}

/* Links navbar */
.nav-link {
  color: rgba(70, 40, 110, 1);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
  text-decoration: none;
}

.nav-link:hover {
  background-color: rgba(70, 40, 110, 0.15);
  color: rgba(70, 40, 110, 1);
}

/* Espaciado para los items */
.navbar-nav {
  gap: 1rem;
}
</style>

