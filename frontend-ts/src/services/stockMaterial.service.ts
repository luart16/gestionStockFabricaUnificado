import api from "./api"

import type { DatosStockMateriales } from "@/modelos/stockMaterial";
export const servicioStockMaterial = {
    crear: async (stockMaterial: DatosStockMateriales) => {
        try {
            const respuesta = await api.post('/stockMaterial/crear', stockMaterial);
            console.log('Stock de material creado exitosamente.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al crear el stock de material.')

        }
    },
}