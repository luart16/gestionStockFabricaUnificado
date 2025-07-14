import Producto from "../../modelos/Producto";
import { Response, Request } from "express";

export const traerNombresDeLosProductos = async (req: Request, res: Response) => {
    try {
        const productos = await Producto.find();
        if (productos.length === 0) {
            res.status(404).json({ error: 'No hay productos registrados.' });
            return;
        }
        const todosLosNombresDeProductos = productos.map(producto => ({
            _id: producto._id,
            nombre: producto.nombre,
            
        }));
        res.status(200).json(todosLosNombresDeProductos);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al traer los nombres.' })
        console.log(error);
    }
}