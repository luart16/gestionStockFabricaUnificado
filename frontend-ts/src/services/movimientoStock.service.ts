import api from "./api"

export const servicioMovimientoStock = {
  //traer el historial por página:
  traerTodos: async (pagina = 1, limite = 10, datoAFiltar = '', fechaInicio='', fechaFinal='') => {
    const respuesta = await api.get('/movimientoStock/traerTodosLosMovimientosStock',
      {
        params: { pagina, limite, datoAFiltar, fechaInicio, fechaFinal } 
      }
    );
    return respuesta.data;
  },

  traerTodosMovimientosSinPaginacion: async () => {
    try {
      const respuesta = await api.get('/movimientoStock/traerTodosLosMovimientosSinPaginacion');
      return respuesta.data;
    } catch (error) {
      console.error(error, 'Error al traer todos los movimientos sin paginación.');
    }
  }
};

