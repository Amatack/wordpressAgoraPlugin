import express from 'express';
const router = express.Router();


router.get('/stats', (req, res) => {
    res.send(`stats`);
});

export default router;
