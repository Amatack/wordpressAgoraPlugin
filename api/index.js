import express from 'express'
const app = express()

import indexRoutes from './routes/index.js'
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';

const PORT = 3000

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});