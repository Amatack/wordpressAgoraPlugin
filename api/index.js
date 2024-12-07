import express from 'express'
const app = express()

import indexRoutes from './routes/index.js'
import stats from './routes/stats.js';

const PORT = 3000

app.use('/stats', stats);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});