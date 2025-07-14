import axios from "axios";
import type { DatosStockMateriales } from "@/modelos/stockMaterial";
export const servicioStockMaterial = {
    crear: async (stockMaterial: DatosStockMateriales) => {
        try {
            const respuesta = await axios.post('http://localhost:3000/api/stockMaterial/crear', stockMaterial);
            console.log('Stock de material creado exitosamente.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al crear el stock de material.')

        }
    },
}