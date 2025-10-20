import Producto from "../../modelos/Producto";
import { Response, Request } from "express";
import MovimientoStock from "../../modelos/MovimientoStock";

interface DatosProductos {
    tipoProducto: string;
    nombre: string;
    color: string;
    descripcion: string;
    precio: number;
    stockSinCompromiso: number;
    comprometido: number;
    moldes: number,
    m2PorMolde: number,
    unidadesPorPaquete: number,
    m2PorPaquete: number,
    kgPorPaquete: number,
}

// Función principal del controlador
export const crearProducto = async (req: Request, res: Response) => {
    try {
        const {
            tipoProducto,
            nombre,
            color,
            descripcion,
            precio,
            stockSinCompromiso,
            comprometido,
            moldes,
            m2PorMolde,
            unidadesPorPaquete,
            m2PorPaquete,
            kgPorPaquete,
        } = req.body as DatosProductos;

        // Calcular stock final
        const stockFinal: number = stockSinCompromiso - comprometido;

        const capacidadTotal: number = moldes * m2PorMolde

        const nuevoProducto = new Producto({
            tipoProducto,
            nombre,
            color,
            descripcion,
            precio,
            moldes,
            m2PorMolde,
            capacidadTotal,
            unidadesPorPaquete,
            m2PorPaquete,
            kgPorPaquete,
            stockSinCompromiso,
            comprometido,
            stockFinal,

        });

        await nuevoProducto.save();
// Guardar movimiento de stock con la hora real actual
        const ahora = new Date(); // fecha y hora exacta

        const movimientoStock = new MovimientoStock({
            tipoProducto,
            productoId: nuevoProducto._id,
            nombre,
            color,
            tipoMovimiento: "INGRESO",
            cantidad: stockFinal,
            observacion: 'Creación de producto.',
            fecha: ahora
        })
        await movimientoStock.save();
        res.status(201).json({ message: 'Movimiento de stock y Producto creado exitosamente.' });

    }
    catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
            return
        }
        res.status(500).json({
            error: error.message || 'Error al crear el producto.'
        });
    }
}