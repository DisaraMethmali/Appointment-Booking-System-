const express = require('express');
const router = express.Router();
const { auth, adminCheck } = require('../middlewares/authMiddleware');
const { getAllAppointments, blockSlot } = require('../controllers/adminController');

router.use(auth, adminCheck);
router.get('/appointments', getAllAppointments);
router.post('/block-slot', blockSlot);

module.exports = router;
