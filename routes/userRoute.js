const express = require('express');

// router
const router = express.Router();

// routers
router.post('/register', (req, res) => {
  res.json({ message: 'register' });
});

module.exports = router;
