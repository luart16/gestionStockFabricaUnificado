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

            <div v-if="traerMovimientosIngresos.length == 0">
                <p class="subtitulo-1 m-0 ">No hay datos disponibles para mostrar</p>
            </div>
            <div v-else>
                <div class="d-flex flex-wrap gap-3 mb-4">
                    <div>
                        <label class="form-label fw-semibold">Fecha inicial:</label>
                        <input type="date" class="form-control" v-model="fechaInicial" />
                    </div>

                    <div>
                        <label class="form-label fw-semibold">Fecha final:</label>
                        <input type="date" class="form-control" v-model="fechaFinal" />
                    </div>

                    <div class="d-flex align-items-end">
                        <button class="btn btn-primario" @click="filtrarPorFecha">Filtrar</button>
                    </div>
                </div>


                <div>
                    <GraficoIngresos v-if="!cargando" :ingresos="movimientosFiltradosIngreso" />
                </div>
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


const store = userStore();

const fechaInicial = ref('')
const fechaFinal = ref('')

const listaMovimientos = ref<DatosHistorialMovimientosStock[]>([])
const cargando = ref(true)

const movimientosFiltradosIngreso = ref<DatosHistorialMovimientosStock[]>([])

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

//Para filtrar por fecha lo que muestran los gráficos:

const filtrarPorFecha = async () => {
    cargando.value = true
    const todos = await servicioMovimientoStock.traerTodosMovimientosSinPaginacion()

    const fechaInicio = fechaInicial.value ? new Date(fechaInicial.value) : null
    const fechaFin = fechaFinal.value ? new Date(fechaFinal.value) : null

    listaMovimientos.value = todos.filter((mov: DatosHistorialMovimientosStock) => {

        const fechaMov = new Date(mov.fecha)
        if (fechaInicio && fechaMov < fechaInicio) return false
        if (fechaFin && fechaMov > fechaFin) return false
        return true
    })

    movimientosFiltradosIngreso.value = listaMovimientos.value.filter(m => m.tipoMovimiento === 'INGRESO')

    cargando.value = false
}


onMounted(() => {
    traerMovimientosIngresos()
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