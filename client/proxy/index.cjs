const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.post('', async (request, response) => {   
   const { url, payload } = request.body;
   const result = await axios.post(url, payload);

   response.send(result.data);
});

app.listen(port, '0.0.0.0');