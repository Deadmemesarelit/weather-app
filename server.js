require('dotenv').config({ path: 'apis.env' });
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;

if (!API_KEY) {
  throw new Error('Missing WEATHER_API_KEY in apis.env');
}

const path = require('path');

// Serve static files (index.html, index.js, style.css, etc.)
app.use(express.static(path.join(__dirname)));


app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'city query parameter is required' });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'failed to fetch weather data', details: err.message });
  }
});

app.get('/api/forecast', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'city query parameter is required' });
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'failed to fetch forecast data', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
