import { model, Schema } from 'mongoose';


const esquemaProducto = new Schema({
    tipoProducto: { type: String, required: true },//si es Piedra, Piso o Placa
    nombre: { type: String, required: true },
    color: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number ,default:0},
    stockSinCompromiso: {type: Number, required: true,min: 0 }, //puede ser 0 si no hay stock    
    comprometido: {type: Number, required: true, min: 0, default: 0  },
    stockFinal: { type: Number},
    moldes: { type: Number},
    m2PorMolde: {type: Number},
    capacidadTotal: { type: Number},
    unidadesPorPaquete: { type: Number},
    m2PorPaquete: { type: Number},
    kgPorPaquete: { type: Number},
})

const Producto = model('Producto', esquemaProducto);

export default Producto;