// import mongoose from "mongoose"; //importo la librería mongoose para poder usar el gestor de base de datos mongoDb

// //Creo una  conexión para la base de datos:
// export const conectarDB = async () => {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/stockPirka')
//         console.log('Base de datos conectada');
//         }
//         catch(error){
//             console.error('Error al conectar a base de datos.', error);
//         }
//     };


//conexión en la nube con mongo Atlas:

import mongoose from 'mongoose';

export const conectarDB = async () => {
    try {
       const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tudb';
mongoose.connect(MONGODB_URI)
        .then(() => console.log('Conectado a MongoDB Atlas'))
        .catch((err: any) => console.error('Error al conectar a MongoDB Atlas:', err));
    } catch (error) {
        console.error('Error al conectar a base de datos.', error);
    }
}
