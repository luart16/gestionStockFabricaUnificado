<template>
  <div
    v-if="store.Logueado"
    class="contenido-app"
  >
    <NavBar />
    <div class="container py-4">
      <div class="mb-4">
        <h1 class="titulo mb-1">
          Productos registrados en sistema
        </h1>
        <p class="subtitulo subtitulo-1 m-0">
          Tipo de producto: {{ tipo }}
        </p>
      </div>      
      
        <!-- Filtro -->
        <div class="d-flex mb-4 flex-wrap gap-3 align-items-end">
          <label class="form-label fw-semibold">Filtro:</label>
          <input
            v-model="datoAFiltar"
            type="text"
            class="form-control"
            placeholder="Buscar por nombre o color"
            style="max-width: 400px;"
          >

          <!-- Selector de cantidad por página -->
          <div class="d-flex align-items-end">
            <label class="form-label me-2">Mostrar:</label>
            <select
              v-model="totalPorPagina"
              class="form-select"
              style="width: auto;"
              @change="cambiarCantidadPorPagina"
            >
              <option :value="10">
                10 por página
              </option>
              <option :value="20">
                20 por página
              </option>
              <option :value="50">
                50 por página
              </option>
            </select>
          </div>
        </div>

        <div v-if="productosExistentes.length == 0">
        <p class="subtitulo-1 m-0 ">
          No hay datos disponibles para mostrar
        </p>
      </div>

        <!-- Tabla -->
        <!-- Vista tipo tarjeta para móviles -->
<div class="d-md-none">
  <div
    class="card mb-3"
    v-for="producto in productosExistentes"
    :key="producto._id"
  >
    <div class="card-body">
      <p class="mb-1"><strong>Tipo:</strong> {{ producto.tipoProducto }}</p>
      <p class="mb-1"><strong>Nombre:</strong> {{ producto.nombre }}</p>
      <p class="mb-1"><strong>Color:</strong> {{ producto.color }}</p>
      <p class="mb-1"><strong>Descripción:</strong> {{ producto.descripcion }}</p>
      <p class="mb-1"><strong>Precio:</strong> {{ producto.precio }}</p>
      <p class="mb-1"><strong>Stock:</strong> {{ producto.stockFinal }}</p>
    </div>
  </div>
</div>

<!-- Vista tabla solo en dispositivos medianos en adelante -->
<div class="table-responsive d-none d-md-block">
  <table class="table table-hover table-bordered align-middle">
    <thead class="table-light">
      <tr>
        <th>Tipo</th>
        <th>Nombre</th>
        <th>Color</th>
        <th>Descripción</th>
        <th>Precio</th>
        <th>Stock</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="producto in productosExistentes"
        :key="producto._id"
      >
        <td>{{ producto.tipoProducto }}</td>
        <td>{{ producto.nombre }}</td>
        <td>{{ producto.color }}</td>
        <td>{{ producto.descripcion }}</td>
        <td>{{ producto.precio }}</td>
        <td>{{ producto.stockFinal }}</td>
      </tr>
    </tbody>
  </table>
</div>


        <!-- Paginación -->
        <nav class="d-flex justify-content-center mt-4">
          <ul class="pagination">
            <li
              class="page-item"
              :class="{ disabled: paginaActual === 1 }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="cambiarPagina(paginaActual - 1)"
              >&laquo;</a>
            </li>
            <li
              v-for="pagina in paginasTotales"
              :key="pagina"
              class="page-item"
              :class="{ active: pagina === paginaActual }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="cambiarPagina(pagina)"
              >{{ pagina }}</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: paginaActual === paginasTotales }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="cambiarPagina(paginaActual + 1)"
              >&raquo;</a>
            </li>
          </ul>
        </nav>
      
    </div>
  </div>

  <div v-else>
    <RequiereLogin />
  </div>
</template>

<script setup lang="ts">
import RequiereLogin from '@/components/RequiereLogin.vue';
import NavBar from '@/components/BarraNavegacion.vue';
import { userStore } from '@/store/user';
import type { DatosProductos } from '@/modelos/producto';
import { ref, onMounted, watch } from 'vue';
import { servicioProducto } from '@/services/producto.service';
import { useRoute } from 'vue-router';

const store = userStore();
const route = useRoute();

const tipo = ref<string>(route.params.tipo as string);
const productosExistentes = ref<DatosProductos[]>([]);

const datoAFiltar = ref('');
const paginaActual = ref(1);
const paginasTotales = ref(1);
const totalPorPagina = ref(10);

const traerTodosPorTipo = async () => {
  try {
    const respuesta = await servicioProducto.traerPorTipo(
      tipo.value,
      paginaActual.value,
      totalPorPagina.value,
      datoAFiltar.value
    );
    productosExistentes.value = respuesta.resultados;
    paginasTotales.value = respuesta.paginasTotales;
    productosExistentes.value.sort(((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })))
  } catch (error) {
    console.error('Error al traer los productos:', error);
  }
};

const cambiarPagina = (nuevaPagina: number) => {
  if (nuevaPagina < 1 || nuevaPagina > paginasTotales.value) return;
  paginaActual.value = nuevaPagina;
  traerTodosPorTipo();
};

//Cambiar la cantidad por página:
const cambiarCantidadPorPagina = () => {
  paginaActual.value = 1
  traerTodosPorTipo()
}

function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number) {
  let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const traerProductosDebounce = debounce(() => {
  paginaActual.value = 1;
  traerTodosPorTipo();
}, 500);

watch(datoAFiltar, () => {
  traerProductosDebounce();
});

onMounted(() => {
  traerTodosPorTipo();
});
</script>

<style scoped>
.titulo {
  font-size: 36px;
  color:rgb(70, 40, 110);
  font-weight: 600;
  text-align: left !important;
  font-family: 'Poppins', sans-serif;
}

.subtitulo {
  font-size: 28px;
  color:  #ff6b8a;
  margin-bottom: 20px;
  font-weight: 300;
  letter-spacing: -0.5px;
  text-align: left !important;
  font-family: 'Poppins', sans-serif;
}

/*Resto de los estilos están en archivo globar style.css */
</style>
