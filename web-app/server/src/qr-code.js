import QRCode from 'qrcode';
import Canvas from 'canvas';

export const generateQR = (text, size) => {
  return new Promise((resolve, reject) => {
    const canvas = Canvas.createCanvas(size, size);
    QRCode.toCanvas(canvas, text, { width: size }, error => {
      // TODO: Return error image
      if (error) {
        reject(error);
      }
      resolve(canvas);
    });
  })
};
