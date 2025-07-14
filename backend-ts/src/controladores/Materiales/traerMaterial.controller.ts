import Material from "../../modelos/Material";
import { Response, Request } from "express";

export const traerMaterialPorId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const material = await Material.findById(id);
        if (!material) {
            res.status(400).json({ error: 'Material no encontrado' });
            return;
        }
        res.status(200).json({
            _id: material._id,
            nombreMaterial: material.nombreMaterial,
            color: material.color,
            descripcion: material.descripcion,
            precio: material.precio,
            stock: material.stock
        })
    }
    catch (error) {
        res.status(500).json({ error: 'Error al traer material por id' })
        console.log(error)
    }
}