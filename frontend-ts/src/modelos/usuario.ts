export interface DatosUsuarios {
    _id: string
    nombreUsuario: string
    email: string
    contrasenia: string
    rol: 'administrador' | 'vendedor',
}