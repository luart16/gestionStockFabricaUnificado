import Producto from "../../modelos/Producto";
import { Response, Request } from "express";

export const traerTodosLosProductos = async (req: Request, res: Response) => {
    try {
        const { pagina = 1, limite = 10, datoAFiltar = '' } = req.query;

        // Query corregido (usar $or con los campos correctos)
        let query = {};
        if (datoAFiltar) {
            query = {
                $or: [
                    { tipoProducto: new RegExp(datoAFiltar.toString(), 'i') },
                    { nombre: new RegExp(datoAFiltar.toString(), 'i') },
                    { color: new RegExp(datoAFiltar.toString(), 'i') },
                ]
            };
        }

        // Ejecutar consulta con paginación
        const productos = await Producto.find(query)
            .skip((Number(pagina) - 1) * Number(limite))
            .limit(Number(limite));

        const totalProductos = await Producto.countDocuments(query);
        
        // Enviar respuesta estructurada
        res.status(200).json({
            resultados: productos,
            totalProductos,
            paginasTotales: Math.ceil(totalProductos / Number(limite)),
            paginaActual: Number(pagina)
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al traer los productos' 
        });
    }
};

export const traerTodosLosProductosSinPaginacion = async (req: Request, res: Response) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al traer los productos' 
        });
    }
};




