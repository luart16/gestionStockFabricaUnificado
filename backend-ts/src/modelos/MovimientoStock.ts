import { model, Schema } from 'mongoose';
import { Types } from 'mongoose';

const esquemaMovimientoStock = new Schema({  
  tipoProducto: {
    type: String, 
    required: true 
  },//si es Piedra, Piso o Placa  
  productoId: {
    type: Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  nombre: { 
    type: String, 
    required: true },
  color: { 
    type: String, 
    required: true 
  },
  tipoMovimiento: {
    type: String,
    enum: ['INGRESO', 'EGRESO','COMPROMETIDO', 'DESCOMPROMETIDO'],
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  stockFinal: {
    type: Number,
  },
  observacion: {
    type: String
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
   
});

const MovimientoStock = model('MovimientoStock', esquemaMovimientoStock);

export default MovimientoStock;