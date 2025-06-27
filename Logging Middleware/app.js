const express = require('express');
const sampleRoute = require('./sampleRoute');

const app = express();
const PORT = 3000;

app.use(express.json());


// app.use('/api', sampleRoute);


app.listen(PORT, () => {
  console.log(`Server runs http://localhost:${PORT}`);
  
});
