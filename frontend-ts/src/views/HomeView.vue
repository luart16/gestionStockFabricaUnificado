<template>
  <div v-if="store.Logueado">
    <NavBar />

<div class="fondo-home">
  <div class="encabezado-home">
    <h1>Gestión inteligente para tu fábrica</h1>
    <p>Controlá productos, stock y movimientos de forma centralizada</p>
  </div>

  <!-- Aquí va TODO tu contenido que ya tenés: categorías de productos, acciones rápidas, etc -->

  <section class="main-content"></section>
  <div class="container mt-5">

      <!-- Categorías de Productos -->
      <div class="categorias-productos">
        <div class="row justify-content-center">
          <!--Tarjeta piedras:-->
          <div class="col-12 col-md-4 mb-4">
            <div class="tarjeta-categoria" @click="irA('Piedra')" style="cursor: pointer;">
              <div class="contenedor-imagen-categoria">
                <img src="@/imagenes/piedra.jpg" class="imagen-categoria" alt="Piedras" />
                <div class="superposicion-categoria">
                  <span class="etiqueta-categoria">Ecológica</span>
                </div>
              </div>
              <div class="contenido-categoria">
                <h3 class="titulo-categoria">Piedras</h3>
                <p class="descripcion-categoria">Piedra ecológica liviana para construcción sustentable</p>
              </div>
            </div>
          </div>

          <!--Tarjeta placas:-->
          <div class="col-12 col-md-4 mb-4">
            <div class="tarjeta-categoria" @click="irA('Placa')" style="cursor: pointer;">
              <div class="contenedor-imagen-categoria">
                <img src="@/imagenes/placa.jpg" class="imagen-categoria" alt="Placas" />
                <div class="superposicion-categoria">
                  <span class="etiqueta-categoria">Anti-Humedad</span>
                </div>
              </div>
              <div class="contenido-categoria">
                <h3 class="titulo-categoria">Placas</h3>
                <p class="descripcion-categoria">Placas anti-humedad para protección y aislamiento</p>
              </div>
            </div>
          </div>

          <!--Tarjeta pisos:-->
          <div class="col-12 col-md-4 mb-4">
            <div class="tarjeta-categoria" @click="irA('Piso')" style="cursor: pointer;">
              <div class="contenedor-imagen-categoria">
                <img src="@/imagenes/piso.jpg" class="imagen-categoria" alt="Pisos" />
                <div class="superposicion-categoria">
                  <span class="etiqueta-categoria">Flotantes</span>
                </div>
              </div>
              <div class="contenido-categoria">
                <h3 class="titulo-categoria">Pisos</h3>
                <p class="descripcion-categoria">Pisos flotantes evolution de alta calidad y durabilidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Acciones rápidas: tarjetas movimiento stock, materiales-->

      <div class="acciones-rapidas mb-5">

        <!-- Barra: Movimientos de Stock (admin) -->
        <router-link v-if="store.Rol === 'administrador'" to="/historialMovimientosDeStock"
          class="barra-acceso-admin barra-verde d-block mb-4 text-decoration-none">
          <div class="contenido-barra d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <i class="bi bi-clipboard-data icono-accion barra-verde-icon"></i>
              <div>
                <h5 class="mb-1 fw-bold">Movimientos de Stock</h5>
                <p class="mb-0">Visualiza entradas y salidas de productos</p>
              </div>
            </div>
            <span class="flecha-icono"><i class="bi bi-arrow-up-right-square-fill"></i></span>
          </div>
        </router-link>

        <!-- Barra: Materiales -->
        <router-link to="/gestionarMateriales" class="barra-acceso-admin barra-rosa d-block mb-4 text-decoration-none">
          <div class="contenido-barra d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <i class="bi bi-boxes icono-accion barra-rosa-icon"></i>
              <div>
                <h5 class="mb-1 fw-bold">Materiales</h5>
                <p class="mb-0">Gestiona tu catálogo</p>
              </div>
            </div>
            <span class="flecha-icono"><i class="bi bi-arrow-up-right-square-fill"></i></span>
          </div>
        </router-link>

        <!-- Barra: Usuarios -->
        <router-link to="/traerUsuarios" class="barra-acceso-admin barra-violeta d-block mb-4 text-decoration-none">
          <div class="contenido-barra d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <i class="bi bi-person-fill-check icono-accion barra-violeta-icon"></i>
              <div>
                <h5 class="mb-1 fw-bold">Usuarios</h5>
                <p class="mb-0">Controla permisos</p>
              </div>
            </div>
            <span class="flecha-icono"><i class="bi bi-arrow-up-right-square-fill"></i></span>
          </div>
        </router-link>

        <!-- Barra: Sucursales -->
        <router-link to="/traerSucursales" class="barra-acceso-admin barra-gris d-block mb-4 text-decoration-none">
          <div class="contenido-barra d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <i class="bi bi-buildings-fill icono-accion barra-gris-icon"></i>
              <div>
                <h5 class="mb-1 fw-bold">Sucursales</h5>
                <p class="mb-0">Administra ubicaciones</p>
              </div>
            </div>
            <span class="flecha-icono"><i class="bi bi-arrow-up-right-square-fill"></i></span>
          </div>
        </router-link>
      </div>

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
.encabezado-home {
  text-align: center;
  color: #392667;
  padding: 4rem 1rem 2rem;
}

.encabezado-home h1 {
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.encabezado-home p {
  font-size: 1.1rem;
  color: #5c4a8c;
}

.fondo-home {
  background: linear-gradient(to bottom, #f6f4fd 0%, #f6f4fd 55%, #e8e6f1 55%, #e8e6f1 100%);
  min-height: 100vh;
  padding-bottom: 3rem;
}


.categorias-productos {
  margin-bottom: 3rem;
}

/* Títulos de sección */
.titulo-seccion {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
}

/* Tarjetas de productos */
.tarjeta-categoria {
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  background-color: #fff;
}

.tarjeta-categoria:hover {
  transform: translateY(-5px);
}

.contenedor-imagen-categoria {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
}

.imagen-categoria {
  width: 100%;
  height: auto;
  object-fit: contain;
  /* hace que la imagen se vea entera sin recortarse */
}

.superposicion-categoria {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.contenido-categoria {
  padding: 1rem;
  text-align: center;
}

.titulo-categoria {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.descripcion-categoria {
  font-size: 0.95rem;
  color: #666;
}

/* Acciones rápidas */

.acciones-rapidas {
  margin-bottom: 3rem;
}

.barra-acceso-admin {
  border-left: 6px solid;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.barra-acceso-admin:hover {
  transform: translateY(-2px);
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Colores personalizados */
.barra-verde {
  background: linear-gradient(90deg, #e8f5e8, #d0ecd0);
  border-color: #4caf50;
  color: #2e7d32;
}

.barra-verde:hover {
  color: #1b5e20;
}

.barra-rosa {
  background: linear-gradient(90deg, #fae6f4, #f2cce9);
  border-color: #dea5cf;
  color: #882a6b;
}

.barra-rosa:hover {
  color: #661b4f;
}

.barra-violeta {
  background: linear-gradient(90deg, #ede9f9, #d8d1f2);
  border-color: #573c9d;
  color: #392667;
}

.barra-violeta:hover {
  color: #2a1c4d;
}

.barra-gris {
  background: linear-gradient(90deg, #f5f5f5, #dcdde1);
  border-color: #ccced3;
  color: #444;
}

.barra-gris:hover {
  color: #222;
}

/* Iconos */
.icono-accion {
  font-size: 2.2rem;
  line-height: 1;
  flex-shrink: 0;
}

.barra-verde-icon {
  color: #4caf50;
}
.barra-rosa-icon {
  color: #dea5cf;
}
.barra-violeta-icon {
  color: #573c9d;
}
.barra-gris-icon {
  color: #ccced3;
}

.flecha-icono {
  font-size: 1.5rem;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .titulo-principal {
    font-size: 2rem;
  }

  .seccion-principal {
    padding: 2rem 1rem;
  }

  .tarjeta-accion {
    margin-bottom: 1rem;
  }
}
</style>