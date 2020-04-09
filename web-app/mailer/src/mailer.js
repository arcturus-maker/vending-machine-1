import nodemailer from 'nodemailer';

// TODO: Make this client configurable
const FROM = '"Vending Machine" <vending@makerindustries.com>';

// TODO: Replace this with something client configurable
const accountPromise = nodemailer.createTestAccount();

export const sendMail = async (to, subject, message)  => {
  const account = await accountPromise;
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  });

  const info = await transporter.sendMail({
    from: FROM,
    to,
    subject,
    html: `<b>${message}</b>`
  });

  return nodemailer.getTestMessageUrl(info);
};