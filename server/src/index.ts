import express from 'express';
import transcriptRoute from './routes/transcript.route.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!');
}); 

app.use("/audio/transcript", transcriptRoute);

app.listen(port, () => {
  console.log('Server is running on port 3000');
});