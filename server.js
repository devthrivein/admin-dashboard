const express = require('express');
const cors = require('cors');
const path = require('path');

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

app.use(express.static(__dirname));
app.get('/index', (req, res)=> {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
