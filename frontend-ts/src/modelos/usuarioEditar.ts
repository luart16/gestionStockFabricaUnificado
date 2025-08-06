export interface DatosUsuariosEditar {
    _id: string
    nombreUsuario: string
    email: string
    telefono: string
    rol: 'administrador' | 'vendedor',
    contrasenia:string
}
