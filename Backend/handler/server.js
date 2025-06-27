const express = require('express');
const mongoose = require('mongoose');
const routeHandler = require('../routes/shortUrlRoute');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3200;

// Middleware
app.use(express.json());
app.use('/shorturls', routeHandler);
app.use('/:shortcode', routeHandler); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error(' MongoDB Atlas connection failed:', err));

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
