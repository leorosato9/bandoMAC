import nodemailer from 'nodemailer';
import { generaContenutoEmail } from '../../lib/mail-contenuto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }

  const { risposte, domande, contatti, campi } = req.body;

  if (!risposte || !domande || !contatti || !campi) {
    return res.status(400).json({ message: 'Dati della richiesta incompleti.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const mailOptions = generaContenutoEmail({ domande, risposte, contatti, campi });

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email inviata con successo!' });
  } catch (error) {
    console.error('Errore invio email:', error);
    return res.status(500).json({ message: 'Errore durante l\'invio del messaggio.' });
  }
}