import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import CrearUsuarioView from '@/views/vistasUsuarios/CrearUsuarioView.vue'
import CrearSucursalView from '@/views/vistasSucursales/CrearSucursalView.vue'
import traerTodosLosUsuariosView from '@/views/vistasUsuarios/traerTodosLosUsuariosView.vue'
import traerTodasLasSucursalesView from '@/views/vistasSucursales/traerTodasLasSucursalesView.vue'
import CrearProductoView from '@/views/vistasProducto/CrearProductoView.vue'
import GestionarProductosView from '@/views/vistasProducto/GestionarProductosView.vue'
import TraerProductosPorTipoView from '@/views/vistasProducto/TraerProductosPorTipoView.vue'
import GestionarMaterialesView from '@/views/vistasMateriales/GestionarMaterialesView.vue'
import CrearMaterialView from '@/views/vistasMateriales/CrearMaterialView.vue'
import StockActualProductosView from '@/views/VistasStockProductosView.vue/StockActualProductosView.vue'
import HistorialMovimientosStockView from '@/views/vistasHistorialMovimientos/HistorialMovimientosStockView.vue'
import IngresosPorProductoView from '@/views/vistasEstadisticas/IngresosPorProductoView.vue'
import EgresosPorProductoView from '@/views/vistasEstadisticas/EgresosPorProductoView.vue'
import ComparaIngresosEgresosPorNombreView from '@/views/vistasEstadisticas/ComparaIngresosEgresosPorNombreView.vue'
import IngresosPorTipoView from '@/views/vistasEstadisticas/IngresosPorTipoView.vue'
import EgresosPorTipoView from '@/views/vistasEstadisticas/EgresosPorTipoView.vue'
import ComparaIngresosEgresosPorTipoView from '@/views/vistasEstadisticas/ComparaIngresosEgresosPorTipoView.vue'

const routes = [

  {
    path: "/",
    name: "login",
    component: LoginView,
  },

  {
    path: '/home',
    name: 'home',
    component: HomeView
  },

  {
    path: '/crearUsuario',
    name: 'crearUsuario',
    component: CrearUsuarioView
  },

  {
    path: '/crearSucursal',
    name: 'crearSucursal',
    component: CrearSucursalView
  },

  {
    path: '/traerUsuarios',
    name: 'traerUsuarios',
    component: traerTodosLosUsuariosView
  },

  {
    path: '/traerSucursales',
    name: 'traerSucursales',
    component: traerTodasLasSucursalesView
  },

  {
    path: '/gestionarProductos',
    name: 'gestionarProductos',
    component: GestionarProductosView
  },

  {
    path: '/crearProducto',
    name: 'crearProducto',
    component: CrearProductoView
  },


  {
    path: '/traerProductosPorTipo/:tipo',
    name: 'traerProductosPorTipo',
    component: TraerProductosPorTipoView
  },  

  {
    path: '/gestionarMateriales',
    name: 'gestionarMateriales',
    component: GestionarMaterialesView
  },

  {
    path: '/crearMaterial',
    name: 'crearMaterial',
    component: CrearMaterialView
  },

  {
    path: '/historialMovimientosDeStock',
    name: 'historialMovimientosDeStock',
    component: HistorialMovimientosStockView
  },

  {
    path: '/stockActualDeProductos',
    name: 'stockActualDeProductos',
    component: StockActualProductosView
  },

  {
  path: '/datosIngresosPorProductos',
  name: 'datosIngresosPorProductos',
  component: IngresosPorProductoView
},

  {
  path: '/datosEgresosPorProductos',
  name: 'datosEgresosPorProductos',
  component: EgresosPorProductoView
},

 {
  path: '/datosIngresosVsEgresosPorProductos',
  name: 'datosIngresosVsEgresosPorProductos',
  component: ComparaIngresosEgresosPorNombreView
},

 {
  path: '/datosIngresosPorTipo',
  name: 'datosIngresosPorTipo',
  component: IngresosPorTipoView
},

{
  path: '/datosEgresosPorTipo',
  name: 'datosEgresosPorTipo',
  component: EgresosPorTipoView
},

{
  path: '/datosIngresosVsEgresosPorTipo',
  name: 'datosIngresosVsEgresosPorTipo',
  component: ComparaIngresosEgresosPorTipoView
},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
