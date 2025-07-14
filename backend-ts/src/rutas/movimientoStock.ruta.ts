 import { Router } from "express";
 import {  traerMovimientoStockPorProducto, traerTodosLosMovimientosStock, } from "../controladores/MovimientoStock";
 import { traerTodosLosMovimientosSinPaginacion } from "../controladores/MovimientoStock/traerTodosLosMovimientosStock.controller";

 const movimientoStockRuta = Router();

 movimientoStockRuta.get('/api/movimientoStock/traerMovimientoStock/:productoId', traerMovimientoStockPorProducto,)
 movimientoStockRuta.get('/api/movimientoStock/traerTodosLosMovimientosStock/', traerTodosLosMovimientosStock)
 movimientoStockRuta.get('/api/movimientoStock/traerTodosLosMovimientosSinPaginacion', traerTodosLosMovimientosSinPaginacion);

 export default movimientoStockRuta;