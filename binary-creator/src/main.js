import express from 'express';
import cors from 'cors';
import { createMapImage } from './service.js';

const app = express();
const port = 5003;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.post('/create-binary/map', async (req, res) => {
    try {
        const { data, error } = await createMapImage(req.body);

        if (error !== null) {
            console.log(error);
            res.status(500).send('Internal server error');
            return;
        }

        const img = Buffer.from(data, 'base64');

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });

        res.end(img);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`The application is running and listening on port ${port}`)
});