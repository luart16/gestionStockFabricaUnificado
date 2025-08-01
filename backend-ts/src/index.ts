import express from 'express';
import cors from 'cors';
import { conectarDB } from './BaseDeDatos/database';
import usuarioRuta from './rutas/usuario.rutas';
import materialRuta from './rutas/material.rutas';
import sucursalRuta from './rutas/sucursal.ruta';
import productoRuta from './rutas/producto.rutas';
import movimientoStockRuta from './rutas/movimientoStock.ruta';
import loginRuta from './rutas/login.ruta'; 
import 'dotenv/config';


const app = express(); //le digo que la app use express
const PORT = 3000; //le digo que use el puerto 3000
app.use(cors());
app.use(express.json());
app.use(usuarioRuta, materialRuta, sucursalRuta, productoRuta,  loginRuta, movimientoStockRuta) //

app.listen(PORT, function () {
    console.log('Servidor en el puerto', PORT);
    conectarDB();
})