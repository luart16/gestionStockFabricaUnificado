import Material from "../../modelos/Material";
import { Response, Request } from "express";

interface DatosMateriales {
    nombreMaterial: String
    color?: String
    descripcion?: String
    precio?: Number
    stock: Number
}

//función principal del controlador:
export const crearMaterial = async (req: Request, res: Response) => {
    try {
        const { nombreMaterial, color, descripcion, precio, stock } = req.body as DatosMateriales;
        //creo un nuevo usuario y lo guardo en la DB con .save:
        const nuevoMaterial = new Material({
            nombreMaterial,
            color,
            descripcion,
            precio,
            stock,
        })
        await nuevoMaterial.save();// aquí guardo el nuevo usuario
        res.status(201).json({ message: 'Material creado exitosamente.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear el material.' });
        console.log(error);
    }
}