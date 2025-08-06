export interface DatosUsuarios {
    _id: string
    nombreUsuario: string
    email: string
    telefono: string
    contrasenia: string
    rol: 'administrador' | 'vendedor',
}