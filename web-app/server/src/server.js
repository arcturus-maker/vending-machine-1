import express from 'express';
import monk from 'monk';

const app = express();
const db = monk('mongo:27017/vending-machine');

const PORT = 8080;

app.use(express.static('static'));

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

app.get('/email', async (req, res) => {
  const emails = db.get('emails');
  const doc = await emails.insert({
    to: 'continuities@gmail.com',
    recipient: 'Michael',
    content: 'This is a test' 
  });
  res.json(doc);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));