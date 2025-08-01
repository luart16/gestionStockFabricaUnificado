<template>
  <nav class="navbar navbar-expand-lg nav-elegante fixed-top">
    <div class="container">
      <router-link
        to="/home"
        class="navbar-brand d-flex flex-row align-items-center"
        @click="cerrarMenu"
      >
        <img
          src="@/imagenes/logoPirka.png"
          alt="Logo Pirka"
          class="logo-img"
        >
      </router-link>
      <span class="usuario-nombre ms-3 d-flex align-items-center">
        <i class="bi bi-person-check me-1" />{{ store.Usuario }}
      </span>

      <button
        class="navbar-toggler"
        type="button"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="cambiarEstadoMenu"
      >
        <span class="navbar-toggler-icon" />
      </button>

      <div
        id="navbarSupportedContent"
        ref="elementoMenu"
        class="collapse navbar-collapse"
      >
        <div class="navbar-nav ms-auto align-items-center">
          <router-link
            to="/home"
            class="nav-link"
            @click="cerrarMenu"
          >
            Inicio
          </router-link>
          <router-link
            v-if="store.Rol == 'administrador'"
            to="/gestionarProductos"
            class="nav-link"
            @click="cerrarMenu"
          >
            Gestionar Productos
          </router-link>          
          <router-link
            v-if="store.Rol == 'administrador'"
            to="/stockActualDeProductos"
            class="nav-link"
            @click="cerrarMenu"
          >
            Gestionar Stock
          </router-link>
          <button
            class="btn-logout"
            title="Cerrar sesión"
            @click="deslogueo"
          >
            <i class="bi bi-box-arrow-right" />
          </button>
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
  font-family: 'Poppins', sans-serif;
}

/* Navbar contenedor */
.nav-elegante {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid #eee;
  padding: 0.75rem 1rem;
  z-index: 999;
}

/* Logo */
.logo-img {
  height: 26px;
  width: auto;
  object-fit: contain;
}
.titulo-logo {
  font-weight: bold;
  font-size: 1.1rem;
  color: #46286e;
}

/* Mejora visual del texto "Usuario: ..." al lado del logo */
/* .usuario-nombre {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 1.3rem;
  color: #46286e; /* púrpura más claro que el logo */
  /* margin-top: 0.25rem;
  margin-left: 4px;
  opacity: 0.9;
} */ 

.usuario-nombre {
  color: #46286e;
}



/* Enlaces navbar */
.nav-link {
  color: #46286e;
  font-weight: 500;
  margin: 0 0.4rem;
  padding: 8px 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(70, 40, 110, 0.1);
  color: #46286e;
}

/* Botón logout con ícono */
.btn-logout {
  background-color: transparent;
  color: #ff6b8a;
  border: 2px solid #ff6b8a;
  padding: 6px 10px;
  border-radius: 50%;
  margin-left: 0.75rem;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.btn-logout:hover {
  background-color: #ff6b8a;
  color: white;
}

/* Responsive spacing */
.navbar-nav {
  gap: 0.75rem;
}

.navbar-brand span {
  font-size: 1.1rem;
  color: #444;
}







</style>

