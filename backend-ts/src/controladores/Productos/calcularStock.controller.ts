import Producto from "../../modelos/Producto";
import { Response, Request } from "express";
import MovimientoStock from "../../modelos/MovimientoStock";

export const calcularStockActual = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tipoDeMovimiento, cantidad, observacion } = req.body;

        const producto = await Producto.findById(id);
        if (!producto) {
            res.status(404).json({ error: "Producto no encontrado." })
            return;
        }

        if (tipoDeMovimiento == "INGRESO") {
            producto.stockSinCompromiso = producto?.stockSinCompromiso + cantidad;
        }

        if (tipoDeMovimiento == "EGRESO") {
            producto.stockSinCompromiso = producto?.stockSinCompromiso - cantidad
        }

        if (tipoDeMovimiento == "COMPROMETIDO") {
            producto.comprometido = producto?.comprometido + cantidad;
        }
        if (tipoDeMovimiento == "DESCOMPROMETIDO") {
            producto.comprometido = producto.comprometido - cantidad;
            if (producto.comprometido < 0) producto.comprometido = 0; // Evita valores negativos

        }
        producto.stockFinal = producto?.stockSinCompromiso - producto.comprometido;
        const hoy = new Date();

        const stockModificado = await producto.save();
        const movimientoStock = new MovimientoStock({
            tipoProducto: producto.tipoProducto,
            productoId: producto._id,
            color: producto.color,
            tipoMovimiento: tipoDeMovimiento,
            nombre: producto.nombre,
            cantidad,
            observacion,
            fecha: hoy,
            stockFinal: producto.stockFinal,
        })
        await movimientoStock.save();
        res.status(200).json(stockModificado);

    }
    catch (error) {
        res.status(500).json({ error: 'Error al calcular el stock.' })
        console.log(error);
    }
}