// routes/donations.js
const express = require('express');
const router = express.Router();

// Test API Route (Ensure this is present)
router.get('/test', (req, res) => {
    res.json({ success: true, message: "Donation API is working!" });
});

// Handle Donations
router.post('/', (req, res) => {
    const { name, email, device, location } = req.body;
    
    if (!name || !email || !device || !location) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    console.log(`📩 Received donation from ${name} (${email}) for ${device} at ${location}`);
    res.json({ success: true, message: 'Donation received' });
});

module.exports = router;
