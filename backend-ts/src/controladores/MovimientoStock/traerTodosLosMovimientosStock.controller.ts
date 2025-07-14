import MovimientoStock from "../../modelos/MovimientoStock";
import { Response, Request } from "express";

//trae todos los movimientos paginados
export const traerTodosLosMovimientosStock = async (req: Request, res: Response) => {
    try {
        const { pagina = 1, limite = 10, datoAFiltar = '', tipoMovimiento = '', fechaInicio, fechaFinal } = req.query;

        const inicio = fechaInicio ? new Date(`${fechaInicio}T00:00:00.000Z`) : null;
        const final = fechaFinal ? new Date(`${fechaFinal}T23:59:59.999Z`): null;

        let query: any = {};

        // Filtro por rango de fechas (opcional)
        if (inicio || final) {
            query.fecha = {}
            if (inicio) {
                // Mayor o igual a la fecha inicial
                query.fecha.$gte = inicio
            }
            if (final) {
                // Menor o igual a la fecha final
                query.fecha.$lte = final
            }
        }

        // Filtro por texto
        if (datoAFiltar) {
            query.$or = [
                { tipoProducto: new RegExp(datoAFiltar.toString(), 'i') },
                { nombre: new RegExp(datoAFiltar.toString(), 'i') },
                { tipoMovimiento: new RegExp(datoAFiltar.toString(), 'i') }
            ];
        }

        const movimientos = await MovimientoStock.find(query)
            .sort({ fecha: -1 }) // Ordenar por fecha descendente
            .skip((Number(pagina) - 1) * Number(limite))
            .limit(Number(limite));

        const totalMovimientos = await MovimientoStock.countDocuments(query);
        res.status(200).json({
            resultados: movimientos,
            totalMovimientos,
            paginasTotales: Math.ceil(totalMovimientos / Number(limite)),
            paginaActual: Number(pagina)
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al traer los movimientos de stock.' })
        console.log(error);
    }
};

//traer todos los movimientos sin paginación:
export const traerTodosLosMovimientosSinPaginacion = async (req: Request, res: Response) => {
    try {
        const movimientos = await MovimientoStock.find().sort({ fecha: -1 });
        res.status(200).json(movimientos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al traer todos los movimientos de stock' });
    }
};




