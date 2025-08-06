import api from "./api"
export const servicioLogin = {
    login: async (email: string, contrasenia: string) => {
        try {
            const respuesta = await api.post('/login', { email, contrasenia });
                console.log('logueado exitoso')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al loguearse.')

        }
    }

}