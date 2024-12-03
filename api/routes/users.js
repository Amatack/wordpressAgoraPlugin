import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Lista de usuarios');
});

router.get('/:id', (req, res) => {
    res.send(`Detalles del usuario con ID: ${req.params.id}`);
});

export default router;
