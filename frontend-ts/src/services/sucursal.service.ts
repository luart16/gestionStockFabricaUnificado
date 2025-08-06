import api from "./api"

import type { DatosSucursales } from "@/modelos/sucursal";

export const servicioSucursal = {
     crear: async (sucursal: DatosSucursales) => {
         try {
             const respuesta = await api.post('/sucursal/crear', sucursal);
             console.log('Sucursal creada exitosamente.')
             return respuesta.data;
        }
         catch (error) {
             console.log(error, 'Error al crear sucursal.')

        }
     },

     traerTodos: async () => {
         try {
             const respuesta = await api.get('/sucursal/traerTodasLasSucursales');
             return respuesta.data;
         }
         catch (error) {
             console.log(error, 'Error al traer sucursales.')
         }
     },

     traerNombreSucursales: async () => {
        try {
            const respuesta = await api.get('/sucursal/traerNombresDeSucursales');
            return respuesta.data;
        } catch (error) {
            console.error(error, 'Error al traer los nombres de sucursales.');
        }
    },

         traerSucursalPorId: async (sucursalId: string) => {
        try {
            const respuesta = await api.get(`/sucursal/traerSucursalPorId/${sucursalId}`);
            console.log('Sucursal encontrada con éxito.')
            return respuesta.data
        }
        catch (error) {
            console.log(error, 'Error al traer la sucursal.')
        }
    },


     eliminar: async (sucursalId: string) => {
         try {
             const respuesta = await api.delete('/sucursal/eliminarSucursal/' + sucursalId);
             console.log('Sucursal eliminada.')
             return respuesta.data;
         }
         catch (error) {
             console.log(error, 'Error al eliminar sucursal.')

         }
     },

     editar: async (sucursalId: string, sucursal: DatosSucursales ) => {
         try{
             const respuesta = await api.put(`/sucursal/modificarSucursal/${sucursalId}`,sucursal);
             console.log('Cambio guardado con éxito.')
             return respuesta.data;
         }
         catch(error){
             console.log(error, 'Error al editar la sucursal.')
         }
     }
}