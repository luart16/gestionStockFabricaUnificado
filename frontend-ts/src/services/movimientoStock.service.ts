import axios from 'axios';

export const servicioMovimientoStock = {
  //traer el historial por página:
  traerTodos: async (pagina = 1, limite = 10, datoAFiltar = '', fechaInicio='', fechaFinal='') => {
    const respuesta = await axios.get('http://localhost:3000/api/movimientoStock/traerTodosLosMovimientosStock',
      {
        params: { pagina, limite, datoAFiltar, fechaInicio, fechaFinal } // ← Parámetros correctos
      }
    );
    return respuesta.data;
  },

  traerTodosMovimientosSinPaginacion: async () => {
    try {
      const respuesta = await axios.get('http://localhost:3000/api/movimientoStock/traerTodosLosMovimientosSinPaginacion');
      return respuesta.data;
    } catch (error) {
      console.error(error, 'Error al traer todos los movimientos sin paginación.');
    }
  }
};

