import axios from "axios";
import type { DatosSucursales } from "@/modelos/sucursal";

export const servicioSucursal = {
     crear: async (sucursal: DatosSucursales) => {
         try {
             const respuesta = await axios.post('http://localhost:3000/api/sucursal/crear', sucursal);
             console.log('Sucursal creada exitosamente.')
             return respuesta.data;
        }
         catch (error) {
             console.log(error, 'Error al crear sucursal.')

        }
     },

     traerTodos: async () => {
         try {
             const respuesta = await axios.get('http://localhost:3000/api/sucursal/traerTodasLasSucursales');
             return respuesta.data;
         }
         catch (error) {
             console.log(error, 'Error al traer sucursales.')
         }
     },

     traerNombreSucursales: async () => {
        try {
            const respuesta = await axios.get('http://localhost:3000/api/sucursal/traerNombresDeSucursales');
            return respuesta.data;
        } catch (error) {
            console.error(error, 'Error al traer los nombres de sucursales.');
        }
    },


     eliminar: async (sucursalId: string) => {
         try {
             const respuesta = await axios.delete('http://localhost:3000/api/sucursal/eliminarSucursal/' + sucursalId);
             console.log('Sucursal eliminada.')
             return respuesta.data;
         }
         catch (error) {
             console.log(error, 'Error al eliminar sucursal.')

         }
     },

     editar: async (sucursalId: string, sucursal: DatosSucursales ) => {
         try{
             const respuesta = await axios.put(`http://localhost:3000/api/sucursal/modificarSucursal/${sucursalId}`,sucursal);
             console.log('Cambio guardado con éxito.')
             return respuesta.data;
         }
         catch(error){
             console.log(error, 'Error al editar la sucursal.')
         }
     }
}