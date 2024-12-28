require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_BACKEND_API_KEY;

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is up and running!' });
});

// ✅ Hamilton County Parcel API
app.get('/api/get-parcel-hamilton', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get(
      'https://services5.arcgis.com/beYj0ONLvCt8qxHA/arcgis/rest/services/Parcels_Current_Open_Data/FeatureServer/0/query',
      {
        params: {
          where: '1=1',
          geometry: `${lng},${lat}`,
          geometryType: 'esriGeometryPoint',
          inSR: '4326',
          spatialRel: 'esriSpatialRelIntersects',
          outFields: 'DEEDACRES',
          f: 'json',
        },
      }
    );

    if (response.data.features?.length > 0) {
      const acreage = parseFloat(response.data.features[0].attributes.DEEDACRES) || 0;
      console.log(`[Hamilton] Parcel Found: ${acreage} acres`);
      res.json({ lotSizeAcres: acreage });
    } else {
      console.warn('[Hamilton] No parcel data found for the given coordinates.');
      res.status(404).json({ error: 'No parcel data found for Hamilton County.' });
    }
  } catch (error) {
    console.error('[Hamilton County API Error]:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch parcel data for Hamilton County.' });
  }
});

// ✅ Marion County Parcel API
app.get('/api/get-parcel-marion', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get(
      'https://gis.indy.gov/server/rest/services/MapIndy/MapIndyProperty/MapServer/10/query',
      {
        params: {
          where: '1=1',
          geometry: `${lng},${lat}`,
          geometryType: 'esriGeometryPoint',
          inSR: '4326',
          spatialRel: 'esriSpatialRelIntersects',
          outFields: 'ACREAGE',
          f: 'json',
        },
      }
    );

    if (response.data?.features?.length > 0) {
      const acreage = parseFloat(response.data.features[0].attributes.ACREAGE) || 0;
      console.log(`[Marion] Parcel Found: ${acreage} acres`);
      res.json({ lotSizeAcres: acreage });
    } else {
      console.warn('[Marion] No parcel data found for the given coordinates.');
      res.status(404).json({ error: 'No parcel data found for Marion County.' });
    }
  } catch (error) {
    console.error('[Marion County API Error]:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch parcel data for Marion County.' });
  }
});

// ✅ One-Time Pricing API
app.get('/api/one-time-pricing', (req, res) => {
  const { dogs, timeSinceLastCleanup, yardSize } = req.query;

  if (!dogs || !timeSinceLastCleanup || !yardSize) {
    return res.status(400).json({
      error: 'Number of dogs, time since last cleanup, and yard size are required.',
    });
  }

  let basePrice = 99; // Starting price for one-time cleanup

  // Adjust base price based on yard size
  switch (yardSize.toLowerCase()) {
    case 'small':
      basePrice += 3.99;
      break;
    case 'medium':
      basePrice += 6.99;
      break;
    case 'large':
      basePrice += 9.99;
      break;
    case 'extra large':
      basePrice += 12.99;
      break;
    default:
      return res.status(400).json({ error: 'Invalid yard size provided.' });
  }

  // Adjust price based on number of dogs
  basePrice += dogs * 10;

  // Adjust price based on time since last cleanup
  switch (timeSinceLastCleanup.toLowerCase()) {
    case 'one week':
      basePrice += 0;
      break;
    case 'two weeks':
      basePrice += 20;
      break;
    case 'one month':
      basePrice += 40;
      break;
    case 'two months':
      basePrice += 60;
      break;
    case 'three months or more':
      basePrice += 80;
      break;
    default:
      return res.status(400).json({ error: 'Invalid cleanup timeframe provided.' });
  }

  console.log(`[One-Time Cleanup] Calculated Price: $${basePrice}`);
  res.json({ totalPrice: `$${basePrice.toFixed(2)}` });
});

// ✅ Error Handling Middleware
app.use((req, res) => {
  console.warn(`[404] Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found.' });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
  console.log('✅ Loaded Backend API Key:', GOOGLE_API_KEY);
});
