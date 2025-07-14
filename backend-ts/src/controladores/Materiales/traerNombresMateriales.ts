import Material from "../../modelos/Material";
import { Response, Request } from "express";

export const traerNombresDeLosMateriales = async (req: Request, res: Response) => {
    try {
        const materiales = await Material.find();
        if (materiales.length === 0) {
            res.status(404).json({ error: 'No hay materiales registrados.' });
            return;
        }
        const todosLosNombresDeMateriales = materiales.map(material => ({
            
            nombre: material.nombreMaterial,
            
        }));
        res.status(200).json(todosLosNombresDeMateriales);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al traer los nombres.' })
        console.log(error);
    }
}