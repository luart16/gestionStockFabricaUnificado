import type { DatosMateriales } from "@/modelos/material";
import api from "./api"

export const servicioMaterial = {
    crear: async (material: DatosMateriales) => {
        try {
            const respuesta = await api.post('/material/crear', material);
            console.log('Material creado exitosamente.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al crear el material.')

        }
    },

    traerTodos:  async (pagina = 1, limite = 10, datoAFiltar = '') => {
        try {
            const respuesta = await api.get('/material/traerTodosLosMateriales',{
                    params: { pagina, limite, datoAFiltar } // ← Parámetros correctos
                });
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al traer los materiales.')
        }
    },

    traerTodosSinPaginacion:  async (pagina = 1, limite = 10, datoAFiltar = '') => {
        try {
            const respuesta = await api.get('/material/traerTodosLosMaterialesSinPaginacion',{
                 params: { pagina, limite, datoAFiltar }
            });
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al traer los materiales.')
        }
    },

    traerNombreMateriales: async () => {
        try {
            const respuesta = await api.get('/producto/traerNombresDeProductos');
            return respuesta.data;
        } catch (error) {
            console.error(error, 'Error al traer los nombres de productos.');
        }
    },

    eliminar: async (materialId: string) => {
        try {
            const respuesta = await api.delete('/material/eliminarMaterial/' + materialId);
            console.log('Material eliminado.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al eliminar material.')

        }
    },

    editar: async (materialId: string, material: DatosMateriales) => {
        try {
            const respuesta = await api.put(`/material/modificarMaterial/${materialId}`, material);
            console.log('Cambio guardado con éxito.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al editar el material.')
        }
    },

    traerMaterialPorId: async (materialId: string) => {
        try {
            const respuesta = await api.get(`/material/traerMaterialPorId/${materialId}`);
            console.log('Material obtenido correctamente.')
            return respuesta.data
        }
        catch (error) {
            console.log(error, 'Error al editar el stock.')
        }
    },
}