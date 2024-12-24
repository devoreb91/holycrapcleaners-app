require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_BACKEND_API_KEY;

// Geocoding Endpoint
app.get('/api/geocode', async (req, res) => {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: 'Address is required' });

  try {
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
    );
    res.json(geocodeResponse.data);
  } catch (error) {
    console.error('Geocoding API Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Static Map Endpoint
app.get('/api/static-map', (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=600x400&maptype=satellite&key=${GOOGLE_API_KEY}`;
  console.log('Static Map API Key:', GOOGLE_API_KEY); // Debugging line
  res.json({ mapUrl });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
  console.log('✅ Loaded Backend API Key:', GOOGLE_API_KEY);
});

