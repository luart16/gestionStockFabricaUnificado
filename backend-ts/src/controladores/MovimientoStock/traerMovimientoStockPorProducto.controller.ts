import MovimientoStock from "../../modelos/MovimientoStock";
import { Request, Response } from "express";
import { Types } from "mongoose";


export const traerMovimientoStockPorProducto = async (req: Request, res: Response) => {
    try {
        const { productoId } = req.params

        if (!productoId || !Types.ObjectId.isValid(productoId)) {
            res.status(400).json({ error: 'ID de producto inválido o no proporcionado.' });
            return;
        }

        const movimientoStockProducto = await MovimientoStock.find({ productoId: new Types.ObjectId(productoId) });

        if (!movimientoStockProducto.length) {
            res.status(404).json({ error: 'No hay movimientos para este producto.' });
            return;
        }
        res.status(200).json({ movimientoStockProducto }); //esto también podría pasarlo directamente así: res.status(200).json(producto);

    }
    catch (error) {
        res.status(500).json({ error: 'Error al traer movimientos del producto.' });
        console.log(error);
    }
}

