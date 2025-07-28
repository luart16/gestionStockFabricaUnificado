<template>
  <div v-if="store.Logueado">
    <NavBar />

    <div class="home-container">

      <!-- Hero -->
      <section class="hero">
        <h1>Gestión inteligente para tu fábrica</h1>
        <p>Controlá productos, stock y movimientos de forma simple y visual.</p>
      </section>

      <!-- Tarjetas de Productos -->
      <section class="productos">
        <div class="producto-card" @click="irA('Piedra')">
          <img src="@/imagenes/piedra.jpg" alt="Piedra" />
          <div class="producto-info">
            <h3>Piedras</h3>
            <p>Controlá el stock de piedras decorativas</p>
            <!--Piedra ecológica liviana para construcción sustentable-->
          </div>
        </div>

        <div class="producto-card" @click="irA('Piso')">
          <img src="@/imagenes/piso.jpg" alt="Piso" />
          <div class="producto-info">
            <h3>Pisos</h3>
            <p>Visualizá los movimientos y cantidades</p> <!--Pisos flotantes evolution de alta calidad y durabilidad-->
          </div>
        </div>

        <div class="producto-card" @click="irA('Placa')">
          <img src="@/imagenes/placa.jpg" alt="Placa" />
          <div class="producto-info">
            <h3>Placas</h3>
            <p>Organizá la producción y entrega</p> <!--Placas anti-humedad para protección y aislamiento-->
          </div>
        </div>

      </section>

      <!--Acceso a gráficos: -->

      <section class="acciones-rapidas">
        <h2>Gráficos de Ingresos y Egresos</h2>
        <div class="acciones-grid">
          <div class="accion" @click="router.push('/datosIngresosPorProductos')">
            <i class="bi bi-box-arrow-in-down"></i>
            <span>Productos con más ingresos</span>
          </div>
          <div class="accion" @click="router.push('/datosEgresosPorProductos')">
            <i class="bi bi-box-arrow-up"></i>
            <span>Productos con más egresos</span>
          </div>
          <div class="accion" @click="router.push('/datosIngresosVsEgresosPorProductos')">
            <i class="bi bi-box-arrow-up me-1"></i>
            <i class="bi bi-box-arrow-down me-2"></i>
            <span>Ingresos vs Egresos - Por Producto -</span>
          </div>
          <div class="accion" @click="router.push('/datosIngresosPorTipo')">
            <i class="bi bi-arrow-up-square-fill"></i>
            <span>Ingresos por tipo de producto</span>
          </div>
          <div class="accion" @click="router.push('/datosEgresosPorTipo')">
            <i class="bi bi-arrow-down-square-fill"></i>
            <span>Egresos por tipo de producto</span>
          </div>
          <div class="accion" @click="router.push('/datosIngresosVsEgresosPorTipo')">
            <i class="bi bi-arrow-up-square-fill"></i>
            <i class="bi bi-arrow-down-square-fill"></i>
            <span>Ingresos vs Egresos - Por Producto -</span>
          </div>
        </div>
      </section>

      <!-- Acciones rápidas: -->

      <section class="acciones-rapidas">
        <h2>Acciones rápidas</h2>
        <div class="row g-4 justify-content-center align-items-stretch">
          <!-- Materiales -->
          <div class="col-12 col-md-6 col-lg-3">
            <router-link to="/gestionarMateriales"
              class="barra-acceso-admin barra-violeta d-block text-decoration-none h-100">
              <div class="contenido-barra d-flex align-items-center gap-3">
                <i class="bi bi-boxes icono-accion barra-rosa-icon"></i>
                <div>
                  <h5 class="mb-1 fw-bold">Materiales</h5>
                  <p class="mb-0">Gestiona tu catálogo</p>
                </div>
              </div>
              <span class="flecha-icono float-end"><i class="bi bi-arrow-up-right-square-fill"></i></span>
            </router-link>
          </div>

          <!-- Usuarios -->
          <div class="col-12 col-md-6 col-lg-3">
            <router-link to="/traerUsuarios"
              class="barra-acceso-admin barra-rosa d-block text-decoration-none h-100">
              <div class="contenido-barra d-flex align-items-center gap-3">
                <i class="bi bi-person-fill-check icono-accion barra-violeta-icon"></i>
                <div>
                  <h5 class="mb-1 fw-bold">Usuarios</h5>
                  <p class="mb-0">Controla permisos</p>
                </div>
              </div>
              <span class="flecha-icono float-end"><i class="bi bi-arrow-up-right-square-fill"></i></span>
            </router-link>
          </div>

          <!-- Sucursales -->
          <div class="col-12 col-md-6 col-lg-3">
            <router-link to="/traerSucursales" class="barra-acceso-admin barra-violeta d-block text-decoration-none h-100">
              <div class="contenido-barra d-flex align-items-center gap-3">
                <i class="bi bi-buildings-fill icono-accion barra-rosa-icon"></i>
                <div>
                  <h5 class="mb-1 fw-bold">Sucursales</h5>
                  <p class="mb-0">Administra ubicaciones</p>
                </div>
              </div>
              <span class="flecha-icono float-end"><i class="bi bi-arrow-up-right-square-fill"></i></span>
            </router-link>
          </div>

          <!-- Movimientos -->
          <div class="col-12 col-md-6 col-lg-3">
            <router-link to="/historialMovimientosDeStock"
              class="barra-acceso-admin barra-rosa d-block text-decoration-none h-100">
              <div class="contenido-barra d-flex align-items-center gap-3">
                <i class="bi bi-clipboard-data icono-accion barra-violeta-icon"></i>
                <div>
                  <h5 class="mb-1 fw-bold">Movimientos</h5>
                  <p class="mb-0">Visualiza entradas y salidas de productos</p>
                </div>
              </div>
              <span class="flecha-icono float-end"><i class="bi bi-arrow-up-right-square-fill"></i></span>
            </router-link>
          </div>
        </div>
      </section>


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
.home-container {
  padding: 2rem;
  min-height: 100vh;
  background-image: linear-gradient(135deg, #f3f4f6aa, #d9dee4aa), url(~@/imagenes/fondo.jpg);
  background-size: auto;
  background-repeat: repeat;
  background-position: top left;
  background-blend-mode: overlay;
}



.hero {
  text-align: center;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.6);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.hero h1 {
  font-size: 2.7rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.hero p {
  color: #555;
  font-size: 1.15rem;
}

/* PRODUCTOS: */

.productos {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.producto-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 280px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.producto-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.producto-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.producto-info {
  padding: 1rem;
  text-align: center;
}

.producto-info h3 {
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  color: #2c3e50;
}

.producto-info p {
  color: #666;
  font-size: 0.95rem;
}

/* ACCIONES RÁPIDAS */
.acciones-rapidas {
  margin-top: 2rem;
  text-align: center;
}

.acciones-rapidas h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

/*Estilo de acceso a gráficos:*/

.acciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

.accion {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.accion:hover {
  background: #eef2f7;
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.accion i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #34495e;
}

.accion span {
  display: block;
  font-size: 1rem;
  color: #2c3e50;
}

/*Estilo de acciones rápidas para opción 2*/

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

.acciones-rapidas .barra-acceso-admin {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Colores personalizados */

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