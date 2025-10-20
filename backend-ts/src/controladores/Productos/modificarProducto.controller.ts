import Producto from "../../modelos/Producto";
import { Request, Response } from "express";

export const modificarProductoPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            tipoProducto, 
            nombre, 
            color, 
            descripcion,
            precio,            
            moldes,
            m2PorMolde,
            unidadesPorPaquete,
            m2PorPaquete,
            kgPorPaquete,
          } = req.body;
        const producto = await Producto.findById(id);
        if (!producto) {
            res.status(400).json({ error: 'Producto no encontrado.' });
            return;
        }
        //Actualiza solo los campos proporcionados:
        if (tipoProducto) {
            producto.tipoProducto = tipoProducto;
        }
        if (nombre) {
            producto.nombre = nombre;
        }
        if (color) {
            producto.color = color;
        }   
       
        producto.descripcion = descripcion !== undefined ? descripcion : producto.descripcion;
        producto.precio = precio !== undefined ? precio : producto.precio;
        producto.moldes = moldes !== undefined ? moldes : producto.moldes;
        producto.m2PorMolde = m2PorMolde !== undefined ? m2PorMolde : producto.m2PorMolde;
        producto.unidadesPorPaquete = unidadesPorPaquete !== undefined ? unidadesPorPaquete : producto.unidadesPorPaquete;
        producto.m2PorPaquete = m2PorPaquete !== undefined ? m2PorPaquete : producto.m2PorPaquete;
        producto.kgPorPaquete = kgPorPaquete !== undefined ? kgPorPaquete : producto.kgPorPaquete;
        producto.capacidadTotal = moldes * m2PorMolde

        const productoModificado = await producto.save();
        res.status(200).json(productoModificado);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al modificar el producto.' })
    }
}


