import Material from "../../modelos/Material";
import { Response, Request } from "express";

//Traer materiales con paginación:
export const traerTodosLosMateriales = async (req: Request, res: Response) => {
    try {
        const { pagina = 1, limite = 10, datoAFiltar = '' } = req.query;

        let query = {};
        if (datoAFiltar) {
            query = {
                $or: [
                    { nombreMaterial: new RegExp(datoAFiltar.toString(), 'i') },
                    { color: new RegExp(datoAFiltar.toString(), 'i') },
                ]
            };
        }

        // Ejecutar consulta con paginación:
        const materiales = await Material.find(query)
            .skip((Number(pagina) - 1) * Number(limite))
            .limit(Number(limite));

            const totalMateriales = await Material.countDocuments(query);

            //Enviar respuesta estructurada:
            res.status(200).json({
            resultados: materiales,
            totalMateriales,
            paginasTotales: Math.ceil(totalMateriales / Number(limite)),
            paginaActual: Number(pagina)
        });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al traer los materiales'});
    }
}

    //traer los materiales sin paginación: 
export const traerTodosLosMaterialesSinPaginacion = async (req: Request, res: Response) => {
    try {
        const materiales = await Material.find()
        if (materiales.length === 0) { // Verificar si el array está vacío
            res.status(404).json({ error: 'No hay materiales registrados' });
            return;
        }
        const todosLosMateriales = materiales.map(material => ({
            _id: material._id,
            nombreMaterial: material.nombreMaterial,
            color: material.color,
            descripcion: material.descripcion,
            precio: material.precio,
            stock: material.stock,

        }));
        res.status(200).json(todosLosMateriales);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al traer los materiales.' })
        console.log(error)
    }
}

