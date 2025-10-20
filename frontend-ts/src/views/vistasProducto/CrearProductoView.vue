<template>
  <div
    v-if="store.Logueado"
    class="contenido-app"
  >
    <div v-if="store.Rol == 'administrador'">
      <NavBar />
      <div class="container py-4">
        <div class="text-center mb-4">
          <h1 class="titulo">
            Crear Producto
          </h1>
          <p class="subtitulo">
            Formulario para registrar un nuevo producto en el sistema.
          </p>
        </div>

        <div
          class="card shadow p-4 mx-auto"
          style="max-width: 800px;"
        >
          <form @submit.prevent="crearProducto">
            <div class="mb-3">
              <label class="subtitulo subtitulo-1">Tipo de producto:</label>
              <select
                v-model="productoACrear.tipoProducto"
                class="form-select"
                required
              >
                <option
                  disabled
                  value=""
                >
                  Seleccione una opción
                </option>
                <option>Piedra</option>
                <option>Placa</option>
                <option>Piso</option>
              </select>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Nombre de producto:</label>
                <input
                  v-model="productoACrear.nombre"
                  type="text"
                  class="form-control"
                  placeholder="Nombre del producto"
                  required
                  @input="productoACrear.nombre = productoACrear.nombre.toUpperCase()"
                >
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Color:</label>
                <input
                  v-model="productoACrear.color"
                  type="text"
                  class="form-control"
                  placeholder="Color del producto"
                  required
                  @input="productoACrear.color = productoACrear.color.toUpperCase()"
                >
              </div>
            </div>

            <div class="mb-3">
              <label class="subtitulo subtitulo-1">Descripción:</label>
              <input
                v-model="productoACrear.descripcion"
                type="text"
                class="form-control"
                placeholder="Descripción breve"
              >
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Precio:</label>
                <input
                  v-model="productoACrear.precio"
                  type="number"
                  step="0.01"
                  class="form-control"
                  placeholder="Precio unitario"
                >
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Stock inicial:</label>
                <input
                  v-model="productoACrear.stockSinCompromiso"
                  type="number"
                  step="0.01"
                  class="form-control"
                  placeholder="Cantidad inicial"
                >
              </div>
            </div>

            <h5 class="subtitulo subtitulo-1 mt-4">
              Capacidad de Producción
            </h5>
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Cantidad de moldes:</label>
                <input
                  v-model="productoACrear.moldes"
                  type="number"
                  class="form-control"
                  placeholder="Cantidad de moldes"
                >
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">M2 por molde:</label>
                <input
                  v-model="productoACrear.m2PorMolde"
                  type="number"
                  step="0.01"
                  class="form-control"
                  placeholder="Metros cuadrados por molde"
                >
              </div>
            </div>

            <hr class="my-4">

            <h5 class="subtitulo subtitulo-1">
              Embalaje
            </h5>
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label fw-semibold">Unidades por paquete:</label>
                <input
                  v-model="productoACrear.unidadesPorPaquete"
                  type="number"
                  class="form-control"
                  placeholder="Unidades por paquete"
                >
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">M2 por paquete:</label>
                <input
                  v-model="productoACrear.m2PorPaquete"
                  type="number"
                  step="0.01"
                  class="form-control"
                  placeholder="Metros cuadrados por paquete"
                >
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Kg por paquete:</label>
                <input
                  v-model="productoACrear.kgPorPaquete"
                  type="number"
                  step="0.01"
                  class="form-control"
                  placeholder="Kilogramos por paquete"
                >
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-end mt-4">
              <button
                type="submit"
                class="btn btn-rosa-a-blanco"
              >
                Crear Producto
              </button>
              <router-link to="/gestionarProductos">
                <button
                  type="button"
                  class="btn btn-gris-a-blanco"
                >
                  Cancelar
                </button>
              </router-link>
            </div>
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
import NavBar from '@/components/BarraNavegacion.vue'
import { userStore } from '@/store/user';
import { useRouter } from 'vue-router';
import RequiereRol from '@/components/RequiereRol.vue';
import { servicioProducto } from '@/services/producto.service';
import type { DatosProductos } from '@/modelos/producto';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const store = userStore();
const router = useRouter();
const toast = useToast();

const productoACrear = ref<DatosProductos>({
  _id: '',
  tipoProducto: '',
  nombre: '',
  color: '',
  descripcion: '',
  precio: 0,
  stockSinCompromiso: 0,
  comprometido: 0,
  moldes: 0,
  m2PorMolde: 0,
  unidadesPorPaquete: 0,
  m2PorPaquete: 0,
  kgPorPaquete: 0,
  capacidadTotal: 0,
  stockFinal: 0

})


const crearProducto = async () => {
  try {
    await servicioProducto.crear(productoACrear.value)
    toast.success('Producto Creado!')
    router.push({ name: 'gestionarProductos' }); 

    // Limpiamos el formulario reseteando el objeto
    productoACrear.value = {
      _id: '',
      tipoProducto: '',
      nombre: '',
      color: '',
      descripcion: '',
      precio: 0,
      stockSinCompromiso: 0,
      comprometido: 0,
      moldes: 0,
      m2PorMolde: 0,
      unidadesPorPaquete: 0,
      m2PorPaquete: 0,
      kgPorPaquete: 0,
      capacidadTotal: 0,
      stockFinal: 0
    }

  }
  catch (error) {
    toast.error('Error al crear el producto.')
    console.error("Error creando producto:", error)
  }
}

</script>

<style scoped>
.titulo {
  font-size: 36px;
  color: #ef5769;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}

.subtitulo {
  font-size: 18px;
  color: rgb(70, 40, 110);
  font-family: 'Poppins', sans-serif;
}

.subtitulo-1 {
  font-weight: 600;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
}

/*Borde rosa sobre el input: */
input:focus,
select:focus {
  border-color: #ef5769;
  box-shadow: 0 0 0 2px rgba(239, 87, 105, 0.2);
  outline: none;
}
input::placeholder,
select::placeholder {
  color: #6c757d;
}


/*Resto de los estilos están en archivo globar style.css */

</style>