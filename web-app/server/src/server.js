import express from 'express';
import multer from 'multer';
import monk from 'monk';
import buildEmail from './build-email.js';
import { generateQRData, generateCode } from './prize-code.js';

const app = express();
const upload = multer();
const db = monk('mongo:27017/vending-machine');

// TODO: Make these configurable
const PORT = 8080;
const SITE_URL = 'http://localhost:8080';

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.json());

app.post('/prize', async (req, res) => {

  // TODO: Validate that it's actually an email address
  if (!req.body.email || !req.body.name) {
    res.sendStatus(400);
    return;
  }

  const code = generateCode();
  const imageData = await generateQRData(code, 200);
  const email = buildEmail({
    to: req.body.email,
    name: req.body.name,
    content: `<img src='${imageData}'>`
  });

  try {
    await Promise.all([
      db.get('prizes').insert({ code, createdAt: Date.now() }),
      db.get('emails').insert(email)
    ]);
  }
  catch(e) {
    res.status(500).send(e);
  }

  res.sendStatus(200);
});

app.get('/prize', async (req, res) => {
  const prizes = await db.get('prizes').find();
  res.json(prizes);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));