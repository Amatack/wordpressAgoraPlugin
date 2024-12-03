import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Lista de productos');
});

router.post('/', (req, res) => {
  res.send('Crear un nuevo producto');
});

export default router;

