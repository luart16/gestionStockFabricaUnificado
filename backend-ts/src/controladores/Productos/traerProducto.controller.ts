import Producto from "../../modelos/Producto";
import { Request, Response } from "express";

export const traerProductoPorId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findById(id);
        if (!producto) {
            res.status(400).json({ error: 'Producto no encontrado.' });
            return;
        }
        res.status(200).json({
            _id: producto._id,
            tipoProducto: producto.tipoProducto,
            nombre: producto.nombre,
            color: producto.color,
            descripcion: producto.descripcion,
            precio: producto.precio,
            m2PorMolde: producto.m2PorMolde,
    capacidadTotal: producto.capacidadTotal,
    unidadesPorPaquete: producto.unidadesPorPaquete,
    m2PorPaquete: producto.m2PorPaquete,
    kgPorPaquete: producto.kgPorPaquete,
    moldes: producto.moldes,
        }) //esto también podría pasarlo directamente así: res.status(200).json(producto);

    }
    catch (error) {
        res.status(500).json({ error: 'Error al traer el producto por id.' });
        console.log(error);
    }
}

