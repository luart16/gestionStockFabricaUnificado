<template>
    <div v-if="store.Logueado" class="contenido-app">
        <NavBar />

        <div class="container py-4">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h1 class="titulo">Gráficos de Movimientos de Stock</h1>
                </div>
               
            </div>


            <div v-if="cargando" class="text-center">
                <span class="spinner-border"></span> Cargando datos...
            </div>

            <div>
                <GraficoIngresos v-if="!cargando" :ingresos="movimientosFiltradosIngreso" />
            </div>

            <div>
                <GraficoEgresos v-if="!cargando" :egresos="movimientosFiltradosEgreso" />
            </div>







        </div>
    </div>

    <div v-else>
        <RequiereLogin />
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userStore } from '@/store/user';
import NavBar from '@/components/BarraNavegacion.vue'
import { servicioMovimientoStock } from '@/services/movimientoStock.service';
import { DatosHistorialMovimientosStock } from '@/modelos/historialMovimientoStock';
import GraficoIngresos from '@/components/GraficoIngresos.vue';
import GraficoEgresos from '@/components/GraficoEgresos.vue';

const store = userStore();

const listaMovimientos = ref<DatosHistorialMovimientosStock[]>([])
const cargando = ref(true)

const movimientosFiltradosIngreso = ref<DatosHistorialMovimientosStock[]>([])
const movimientosFiltradosEgreso = ref<DatosHistorialMovimientosStock[]>([])

const traerMovimientosIngresos = async () => {
    try {
        cargando.value = true
        const todos: DatosHistorialMovimientosStock[] = await servicioMovimientoStock.traerTodosMovimientosSinPaginacion()

        listaMovimientos.value = todos
        movimientosFiltradosIngreso.value = todos.filter(m => m.tipoMovimiento === 'INGRESO')
    }
    catch (error) {
        console.error('Error al traer movimientos:', error)
    }
    finally {
        cargando.value = false
    }
}

const traerMovimientosEgresos = async () => {
    try {
        cargando.value = true
        const todos: DatosHistorialMovimientosStock[] = await servicioMovimientoStock.traerTodosMovimientosSinPaginacion()

        listaMovimientos.value = todos
        movimientosFiltradosEgreso.value = todos.filter(m => m.tipoMovimiento === 'EGRESO')
    }
    catch (error) {
        console.error('Error al traer movimientos:', error)
    }
    finally {
        cargando.value = false
    }
}

onMounted(() => {
    traerMovimientosIngresos()
    traerMovimientosEgresos()
})


</script>

<style scoped>
.titulo {
    font-size: 36px;
    color: #ef5769;
    font-weight: 600;
}

.text-rosado {
    color: #ef5769 !important;
}
</style>