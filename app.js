const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, console.log('Connected to MongoDB'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
