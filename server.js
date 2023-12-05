const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch').default;


const app = express();
const PORT = 3000;

// cors middleware
app.use(cors({
  origin: '*',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
  optionsSuccessStatus: 204,
}));

app.options('*', cors());

app.get('/getBanners', async (req, res) => {
  try {
    const apiUrl = 'https://thrivein-api-v1-ihovaneucq-et.a.run.app/banners';
    const response = await fetch(apiUrl, {
      headers: {  
        'Authorization': `Bearer ${token}`, 
      },
    });

    // Check if the response status is okay
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
    }

    // Send the JSON response
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
