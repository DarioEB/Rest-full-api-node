import mongoose from 'mongoose';
import colors from 'colors';
const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Base de datos conectada'.blue);
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión con la base de datos');
    }

}

export {
    dbConnection
}