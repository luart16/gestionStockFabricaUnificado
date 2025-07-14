import { Router } from "express";
import { crearMaterial, traerMaterialPorId, traerTodosLosMateriales, eliminarMaterialPorId, modificarMaterialPorId, traerNombresDeLosMateriales, } from "../controladores/Materiales";
import { traerTodosLosMaterialesSinPaginacion } from "../controladores/Materiales/traerTodosLosMateriales.controller";

const materialRuta = Router();

materialRuta.post('/api/material/crear', crearMaterial) //creo una ruta, que es la que me va a dirigir a crear un usuario.
materialRuta.get('/api/material/traerMaterialPorId/:id', traerMaterialPorId);
materialRuta.get('/api/material/traerTodosLosMateriales', traerTodosLosMateriales);
materialRuta.get('/api/material/traerTodosLosMaterialesSinPaginacion', traerTodosLosMaterialesSinPaginacion );
materialRuta.delete('/api/material/eliminarMaterial/:id', eliminarMaterialPorId);
materialRuta.put('/api/material/modificarMaterial/:id', modificarMaterialPorId);
materialRuta.get('/api/producto/traerNombresDeMateriales', traerNombresDeLosMateriales)
export default materialRuta;