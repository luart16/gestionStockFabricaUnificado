import axios from "axios";

export const servicioLogin = {
    login: async (email: string, contrasenia: string) => {
        try {
            const respuesta = await axios.post('http://localhost:3000/api/login', { email, contrasenia });
                console.log('logueado exitoso')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al loguearse.')

        }
    }

}