import express from 'express';
import monk from 'monk';
import buildEmail from './build-email.js';
import { generateQR } from './qr-code.js';

const app = express();
const db = monk('mongo:27017/vending-machine');

const PORT = 8080;

app.use(express.static('static'));

app.get('/qr/:code.png', async (req, res) => {
  // TODO: Validate the input because hackers
  const qrCanvas = await generateQR(req.params.code, 200);
  res.setHeader('Content-Type', 'image/png');
  qrCanvas.pngStream().pipe(res);
});


// === TEST ENDPOINTS
app.get('/email', async (req, res) => {
  const emails = db.get('emails');
  const doc = await emails.insert(buildEmail({
    to: 'continuities@gmail.com',
    name: 'Michael',
    content: 'This is a test'
  }));
  res.json(doc);
});

app.get('/put/:word', async (req, res) => {
  const test = db.get('test');
  const docs = await test.insert({ word: req.params.word });
  res.json(docs);
});

app.get('/get', async (req, res) => {
  const test = db.get('test');
  const docs = await test.find();
  res.json(docs);
});
// === /TEST ENDPOINTS

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));