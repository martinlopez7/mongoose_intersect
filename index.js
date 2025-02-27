const mongoose = require('mongoose');
const { getdata } = require('./api.js');
const uri = 'mongodb://127.0.0.1:27017/intersect';

// Función principal para inicializar la conexión y realizar la inserción
const main = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(uri, {
      autoIndex: false, // No construir índices automáticamente
      maxPoolSize: 10, // Mantener hasta 10 conexiones activas
      serverSelectionTimeoutMS: 5000, // Tiempo de espera antes de fallo en selección de servidor
      socketTimeoutMS: 45000, // Cerrar conexiones inactivas tras 45s
      family: 4 // Usar IPv4
    });
    console.log('✅ Conexión exitosa a MongoDB');

    // Obtener los datos de la API
    let query;
    try {
      query = await getdata();
      console.log('📥 Datos obtenidos:', query);
    } catch (error) {
      console.error('❌ Error obteniendo datos:', error);
      process.exit(1);
    }

    // Definir el esquema
    const intersectSchema = new mongoose.Schema({
      // Caso 1: Array de objetos
      intersect: [{
        edificio: { type: String, required: true }
      }],
      // Caso 2: Cadena simple
      edificio: { type: String }
    });

    // Crear el modelo
    const Intersect = mongoose.model('Intersect', intersectSchema);

    // Insertar datos en la base de datos
    try {
      if (query.intersect && Array.isArray(query.intersect)) {
        // Si intersect es un array, insertamos los elementos
        const result = await Intersect.insertMany(query.intersect.map(item => ({ edificio: item })));
        console.log('✅ Datos insertados:', result);
      } else {
        // Si intersect no es un array, insertamos como un solo documento
        const result = await Intersect.create({ edificio: query.intersect });
        console.log('✅ Documento insertado:', result);
      }
    } catch (e) {
      console.error('❌ Error insertando datos:', e);
    }

    // Cerrar la conexión y salir
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ No se pudo conectar a MongoDB:', error);
    process.exit(1);
  }
};

// Ejecutar la función principal
main();