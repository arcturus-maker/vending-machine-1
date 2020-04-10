import express from 'express';
import monk from 'monk';
import buildEmail from './build-email.js';
import { generateQR, generateCode } from './prize-code.js';

const app = express();
const db = monk('mongo:27017/vending-machine');

// TODO: Make these configurable
const PORT = 8080;
const SITE_URL = 'http://localhost:8080';

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/qr/:code.png', async (req, res) => {
  try {
    const qrCanvas = await generateQR(req.params.code, 200);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31557600');
    qrCanvas.pngStream().pipe(res);
  }
  catch {
    // Wasn't a valid code
    res.redirect('/error.png');
  }
});

app.post('/prize', async (req, res) => {

  // TODO: Validate that it's actually an email address
  if (!req.body.email || !req.body.name) {
    res.sendStatus(400);
    return;
  }

  const code = generateCode();
  const email = buildEmail({
    to: req.body.email,
    name: req.body.name,
    content: `<img src='${SITE_URL}/qr/${code}.png'>`
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