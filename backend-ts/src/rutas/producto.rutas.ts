import { Router } from "express";
import { crearProducto, traerTodosLosProductos, eliminarProductoPorId, modificarProductoPorId, calcularStockActual, traerProductoPorId, traerNombresDeLosProductos, } from "../controladores/Productos";
import { traerProductoPorTipo } from "../controladores/Productos/traerProductoPorTipo.controller";
import { traerTodosLosProductosSinPaginacion } from "../controladores/Productos/traerTodosLosProductos.controller";

const productoRuta = Router();

productoRuta.post('/api/producto/crear', crearProducto);
productoRuta.get('/api/producto/traerTodosLosProductos', traerTodosLosProductos);
productoRuta.get('/api/producto/traerTodosLosProductosSinPaginacion', traerTodosLosProductosSinPaginacion );
productoRuta.delete('/api/producto/eliminarProducto/:id', eliminarProductoPorId);
productoRuta.put('/api/producto/modificarProducto/:id', modificarProductoPorId);
productoRuta.put('/api/producto/modificarStockDeProducto/:id', calcularStockActual);
productoRuta.get('/api/producto/traerProductoPorId/:id', traerProductoPorId);
productoRuta.get('/api/producto/traerPorTipo', traerProductoPorTipo);
productoRuta.get('/api/producto/traerNombresDeProductos', traerNombresDeLosProductos);

export default productoRuta;