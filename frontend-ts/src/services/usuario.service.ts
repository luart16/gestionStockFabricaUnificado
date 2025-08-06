import api from "./api"

import type { DatosUsuarios } from "@/modelos/usuario";
import type {DatosUsuariosEditar} from "@/modelos/usuarioEditar"
export const servicioUsuario = {
    crear: async (usuario: DatosUsuarios) => {
        try {
            const respuesta = await api.post('/usuario/crear', usuario);
            console.log('Usuario creado exitosamente.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al crear usuario.')

        }
    },

    traerTodos: async () => {
        try {
            const respuesta = await api.get('/usuario/traerTodosLosUsuarios');
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al traer usuarios.')
        }
    },

    eliminar: async (usuarioId: string) => {
        try {
            const respuesta = await api.delete('/usuario/eliminarUsuario/' + usuarioId);
            console.log('Usuario eliminado.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al eliminar usuario.')

        }
    },

    editar: async (usuarioId: string, usuario: DatosUsuariosEditar ) => {
        try{
            const respuesta = await api.put(`/usuario/modificarUsuario/${usuarioId}`,usuario);
            console.log('Usuario eliminado.')
            return respuesta.data;

        }
        catch(error){
            console.log(error, 'Error al editar el usuario.')
        }
    },

        traerUsuarioPorId: async (usuarioId: string) => {
        try {
            const respuesta = await api.get(`/usuario/traerUsuarioPorId/${usuarioId}`);
            console.log('Usuario encontrado con éxito.')
            return respuesta.data
        }
        catch (error) {
            console.log(error, 'Error al traer el usuario.')
        }
    },

}