import Sucursal from "../../modelos/Sucursal";
import { Response, Request } from "express";

export const traerNombresDeSucursales = async (req: Request, res: Response) => {
    try {
        const sucursales = await Sucursal.find();
        if (sucursales.length === 0) {
            res.status(404).json({ error: 'No hay sucursales registradas.' });
            return;
        }
        const todosLosNombresDeSucursales = sucursales.map(sucursal => ({
            
            _id: sucursal._id,
            nombre: sucursal.nombreSucursal,         
            
        }));
        res.status(200).json(todosLosNombresDeSucursales);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al traer los nombres de sucursales.' })
        console.log(error);
    }
}