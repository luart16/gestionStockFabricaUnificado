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

const mongoose = require('mongoose');

export const conectarDB = async () => {
    try {
        const uri = process.env.MONGO_URI as string;
        await mongoose.connect(uri)
        .then(() => console.log('✅ Conectado a MongoDB Atlas'))
        .catch((err: any) => console.error('❌ Error al conectar a MongoDB Atlas:', err));
    } catch (error) {
        console.error('Error al conectar a base de datos.', error);
    }
}
