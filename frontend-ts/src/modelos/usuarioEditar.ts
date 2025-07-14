export interface DatosUsuariosEditar {
    _id: string
    nombreUsuario: string
    email: string
    rol: 'administrador' | 'vendedor',
    contrasenia:string
}
