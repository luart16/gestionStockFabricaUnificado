<template>
  <div style="max-width: 800px; margin: auto;">
    <Bar v-if="datosGrafico.labels.length" :data="datosGrafico" :options="opcionesGrafico" />
    <p v-else>No hay datos disponibles para mostrar.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Definir props con tipado más preciso
const props = defineProps<{
  ingresos: { nombre: string; cantidad: number }[]
}>()

// Computar dinámicamente los datos del gráfico
const datosGrafico = computed(() => {
  if (!props.ingresos || props.ingresos.length === 0) {
    return {
      labels: [],
      datasets: []
    }
  }

  const resumenPorProducto: Record<string, number> = {}

  props.ingresos.forEach(item => {
    if (!item.nombre) return
    if (!resumenPorProducto[item.nombre]) resumenPorProducto[item.nombre] = 0
    resumenPorProducto[item.nombre] += item.cantidad || 0
  })

  const productosOrdenados = Object.entries(resumenPorProducto)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return {
    labels: productosOrdenados.map(e => e[0]),
    datasets: [{
      label: 'Cantidad Ingresada',
      data: productosOrdenados.map(e => e[1]),
      backgroundColor: '#058c42'
    }]
  }
})

const opcionesGrafico = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: { 
        display: true, 
        text: 'Top 10 Productos Con Más Ingresos',
        color: '#353535', //color del título
        font: {size: 20}
     } 
},
scales: {
    y: {
      beginAtZero: true, // para que el eje empiece en cero
      ticks: {color: '#0b090a'},  // color de las etiquetas del eje Y      
      grid: {color: '#bcbdc2'},  // color de las líneas de la grilla    
        border: {
        color: '#0b090a',// color para la línea del eje y
        width: 1 //grosor para la línea del eje y
      }, 
    },
    x: {
      ticks: {color: '#0b090a'},  // color etiquetas eje X      
      grid: {color: '#bcbdc2'}, //color de las líneas de la grilla 
      border: {
        color: '#0b090a',// color para la línea del eje x
        width: 1 //grosor para la línea del eje x
      },     
    },
    
  }
}

</script>
