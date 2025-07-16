<template>
  <div v-if="store.Logueado">
    <NavBar />
    <div class="container mt-5">

      <!-- Categorías de Productos -->
      <div class="categorias-productos">
        <h2 class="titulo-seccion">Categorías de Productos</h2>
        <div class="row justify-content-center">
          <!--Tarjeta piedras:-->
          <div class="col-12 col-md-4 mb-4">
            <div class="tarjeta-categoria" @click="irA('Piedra')" style="cursor: pointer;">
              <div class="contenedor-imagen-categoria">
                <img src="@/imagenes/piedra.jpg" class="imagen-categoria" alt="Piedras">
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
                <img src="@/imagenes/placa.jpg" class="imagen-categoria" alt="Placas">
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
                <img src="@/imagenes/piso.jpg" class="imagen-categoria" alt="Pisos">
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

      <!--Acciones rápidas: tarjetas movimiento stock,  materiales-->

      <div class="acciones-rapidas mb-5">
        <h2 class="titulo-seccion"> Acciones Rápidas</h2>
        <div class="row">
        <div class="col-12 col-md-6 col-lg-3 mb-3">
          <router-link to="/historialMovimientosDeStock" class="tarjeta-accion primaria">
            <div class="icono-accion">📊</div>
            <h5>Movimientos de Stock</h5>
            <p>Visualiza entradas y salidas</p>
          </router-link>
        </div>

        <div class="col-12 col-md-6 col-lg-3 mb-3">
            <router-link to="/traerTodosLosMateriales" class="tarjeta-accion">
              <div class="icono-accion">🧱</div>
              <h5>Materiales</h5>
              <p>Gestiona tu catálogo</p>
            </router-link>
          </div>

          <div class="col-12 col-md-6 col-lg-3 mb-3">
            <router-link to="/traerUsuarios" class="tarjeta-accion">
              <div class="icono-accion">👥</div>
              <h5>Usuarios</h5>
              <p>Controla permisos</p>
            </router-link>
          </div>

          <div class="col-12 col-md-6 col-lg-3 mb-3">
            <router-link to="/traerSucursales" class="tarjeta-accion">
              <div class="icono-accion">🏢</div>
              <h5>Sucursales</h5>
              <p>Administra ubicaciones</p>
            </router-link>
          </div>
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

/*Tarjetas: */

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

/*Acciones rápidas: */

.acciones-rapidas {
  margin-bottom: 3rem;
}
.tarjeta-accion {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
  border-left: 4px solid #e91e63;
  display: block;
  height: 100%;
}
.tarjeta-accion:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  color: #333;
}
.tarjeta-accion.primaria {
  border-left-color: #4CAF50;
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
}
.icono-accion {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.tarjeta-accion h5 {
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.tarjeta-accion p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0;
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