import QRCode from 'qrcode';
import Canvas from 'canvas';
import UUID from 'uuid';

export const generateQR = (code, size) => {
  if (!isCode(code)) {
    return Promise.reject('Not a prize code');
  }
  return new Promise((resolve, reject) => {
    const canvas = Canvas.createCanvas(size, size);
    QRCode.toCanvas(canvas, code, { width: size }, error => {
      // TODO: Return error image
      if (error) {
        reject(error);
      }
      resolve(canvas);
    });
  })
};

export const generateCode = () => UUID.v4();

const codeMatcher = /^[a-zA-Z0-9-]+$/;
export const isCode = text => codeMatcher.test(text);

