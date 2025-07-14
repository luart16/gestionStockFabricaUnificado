import Material from "../../modelos/Material";
import { Response, Request } from "express";

export const modificarMaterialPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            nombreMaterial, 
            color, 
            descripcion,
            precio,
            stock
        } = req.body;

        const material = await Material.findById(id);
        if (!material) {
            res.status(400).json({ error: 'Material no encontrado.' });
            return;
        }

        // Actualiza todos los campos incluso si están vacíos
        material.nombreMaterial = nombreMaterial !== undefined ? nombreMaterial : material.nombreMaterial;
        material.color = color !== undefined ? color : material.color;
        material.descripcion = descripcion !== undefined ? descripcion : material.descripcion;
        material.precio = precio !== undefined ? precio : material.precio;
        material.stock = stock !== undefined ? stock : material.stock;

        const materialModificado = await material.save();
        res.status(200).json(materialModificado);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al modificar el material.' })
    }
}