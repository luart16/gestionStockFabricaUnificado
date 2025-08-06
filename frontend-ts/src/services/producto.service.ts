import api from "./api"
import type { DatosProductos } from "@/modelos/producto";
import type { DatosProductosEditar } from "@/modelos/productoEditar";
import type { MovimientoStock } from "@/modelos/movimientoStock";

export const servicioProducto = {
    crear: async (producto: DatosProductos) => {
        try {
            const respuesta = await api.post('/producto/crear', producto);
            console.log('Producto creado exitosamente.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al crear el producto.')

        }
    },

    //para traer con paginación y filto:
    traerTodos: async (pagina = 1, limite = 10, datoAFiltar = '') => {
        try {
            const respuesta = await api.get(
                '/producto/traerTodosLosProductos',
                {
                    params: { pagina, limite, datoAFiltar } // ← Parámetros correctos
                }
            );
            return respuesta.data;
        } catch (error) {
            console.log(error, 'Error al traer productos.');
        }
    },

    //para traer todo sin paginación ni filtro:
    traerTodosSinPaginacion: async () => {
    try {
        const respuesta = await api.get('/producto/traerTodosLosProductosSinPaginacion');
        return respuesta.data;
    } catch (error) {
        console.error(error, 'Error al traer todos los productos sin paginación.');
    }
},


    
  traerPorTipo: async (tipo: string, pagina = 1, limite = 10, datoAFiltar = '') => {
    try {
        const respuesta = await api.get(`/producto/traerPorTipo`, {
            params: { tipo, pagina, limite, datoAFiltar }
        });
        return respuesta.data;
    } catch (error) {
        console.error(error, 'Error al traer productos por tipo.');
    }
},

    traerNombreProductos: async () => {
        try {
            const respuesta = await api.get('/producto/traerNombresDeProductos');
            return respuesta.data;
        } catch (error) {
            console.error(error, 'Error al traer los nombres de productos.');
        }
    },

    eliminar: async (productoId: string) => {
        try {
            const respuesta = await api.delete('/producto/eliminarProducto/' + productoId);
            console.log('Producto eliminado.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al eliminar producto.')

        }
    },

    editar: async (productoId: string, producto: DatosProductosEditar) => {
        try {
            const respuesta = await api.put(`/producto/modificarProducto/${productoId}`, producto);
            console.log('Cambio guardado con éxito.')
            return respuesta.data;
        }
        catch (error) {
            console.log(error, 'Error al editar el producto.')
        }
    },

    calcularStock: async (productoId: string, movimiento: MovimientoStock) => {
        try {
            await api.put(`/producto/modificarStockDeProducto/${productoId}`, movimiento);
            console.log('Cambio guardado con éxito.')
        }
        catch (error) {
            console.log(error, 'Error al editar el stock.')
        }
    },
    traerProductoPorId: async (productoId: string) => {
        try {
            const respuesta = await api.get(`/producto/traerProductoPorId/${productoId}`);
            console.log('Cambio guardado con éxito.')
            return respuesta.data
        }
        catch (error) {
            console.log(error, 'Error al editar el stock.')
        }
    },
}