import cron from 'node-cron';
import monk from 'monk';
import { sendMail } from './mailer.js';

const db = monk('mongo:27017/vending-machine');

cron.schedule('*/10 * * * * *', async () => {
  const pending = await db.get('emails').find();
  const ids = pending.map(e => e._id);
  console.log(`Sending ${ids.length} pending emails...`);
  pending.forEach(e => {
    sendMail(
      e.to, 
      `Test message for ${e.recipient}`, 
      e.content
    ).then(console.log);
  });
  db.get('emails').remove({ _id: { $in: ids } });
});