import Producto from "../../modelos/Producto";
import { Request, Response } from "express";

export const traerProductoPorTipo = async (req: Request, res: Response) => {
    try {
        const { tipo, pagina = 1, limite = 10, datoAFiltar = '' } = req.query;

        if (!tipo || typeof tipo !== 'string') {
            res.status(400).json({ error: 'Tipo de producto no especificado o inválido.' });
            return;
        }

        let query: any = { tipoProducto: tipo };

        if (datoAFiltar && datoAFiltar.toString().trim() !== '') {
            query.$or = [
                { nombre: new RegExp(datoAFiltar.toString(), 'i') },
                { color: new RegExp(datoAFiltar.toString(), 'i') }
            ];
        }

        const productos = await Producto.find(query)
            .skip((Number(pagina) - 1) * Number(limite))
            .limit(Number(limite));

        const totalProductos = await Producto.countDocuments(query);

        res.status(200).json({
            resultados: productos,
            totalProductos,
            paginasTotales: Math.ceil(totalProductos / Number(limite)),
            paginaActual: Number(pagina)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar productos por tipo.' });
    }
};
