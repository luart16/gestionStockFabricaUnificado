<template>
    <div v-if="store.Logueado">
        <div v-if="store.Rol == 'administrador'">
            <NavBar />
            <div class="login-container">
                <div class="presentacion">
                    <h1 class="titulo">Crear Stock de Material</h1>
                    <p class="subtitulo subtitulo-1">Formulario para registrar un nuevo stock de material.</p>
                </div>

                <div class="login-box">
                    <form @submit.prevent="crearStockMaterial">
                        <div>
                            <label>Nombre de material:</label>
                            <select v-model="stockMaterialACrear.materialId" required>
                                <option v-for="material in nombresDeMateriales" :key="material._id" :value="material._id">
                                    {{ material.nombre }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label>Nombre de sucursal:</label>
                            <select v-model="stockMaterialACrear.sucursalId" required>
                                <option v-for="sucursal in nombresDeSucursales" :key="sucursal._id" :value="sucursal._id">
                                    {{ sucursal.nombre }}
                                </option>
                            </select>
                        </div>
                        <input v-model="stockMaterialACrear.cantidad" type="number" placeholder="Cantidad" required />
                        <button type="submit" class="btn-principal">Crear Stock de Producto</button>
                        <P>***PONER UN MENSAJE DE ÉXITO AL APRETAR EL BOTÓN DE CREAR PARA SABER SI SE CREÓ Y
                            MANTENER EN ESTA PÁG.</P>
                        <router-link to="/gestionarProductos">
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
import NavBar from '@/components/BarraNavegacion.vue'
import { userStore } from '@/store/user';
import RequiereRol from '@/components/RequiereRol.vue';
import { servicioStockMaterial } from '@/services/stockMaterial.service';
import { servicioMaterial } from '@/services/material.service';
import { ref, onMounted } from 'vue';
import { DatosStockMateriales } from '@/modelos/stockMaterial';
import { servicioSucursal } from '@/services/sucursal.service';

const store = userStore();
const nombresDeMateriales = ref();
const nombresDeSucursales = ref();

const stockMaterialACrear = ref<DatosStockMateriales>({
    _id: '',
    materialId: '',
    sucursalId: '',
    cantidad: 0,
    enStock: true,
}) 



const crearStockMaterial = async () => {
    try {
        await servicioStockMaterial.crear(stockMaterialACrear.value)
        //router.push({ name: 'traerSucursales' }); (si lo quiero implementar debo declarar arriba: const router = useRouter();)
    }
    catch (error) {
        console.error("Error creando stock de producto:", error)
    }
}

const traerTodos = async () => {
    try {
        const respuesta = await servicioMaterial.traerNombreMateriales()
        nombresDeMateriales.value = respuesta;
    }
    catch (error) {
        console.error("Error al traer los nombres de materiales:", error)

    }

}

const traerNombresSucursales = async () => {
    try {
        const respuesta = await servicioSucursal.traerNombreSucursales()
        nombresDeSucursales.value = respuesta;
    }
    catch (error) {
        console.error("Error al traer los nombres de productos:", error)

    }

}

onMounted(() => {
    traerTodos();
    traerNombresSucursales();
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
