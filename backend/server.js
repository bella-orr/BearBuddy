require('dotenv').config();

const express = require('express');

const axios = require('axios');

const app = express();

const PORT = process.env.PORT || 3000;

// Allow Express to process JSON requests
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('UC Campus Map Backend Running');
});

// Convert an address into coordinates
app.get('/api/geocode', async (req, res) => {
    try {
        const address = req.query.address;

        if (!address) {
            return res.status(400).json({
                error: 'Address is required'
            });
        }

const response = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
                params: {
                    address: address,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error('Google Maps request failed:', error.message);

        res.status(500).json({
            error: 'Failed to retrieve location'
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});