import nodemailer from 'nodemailer';
import { generaContenutoEmail } from '../../lib/mail-contenuto';
// Import diretto dei tuoi dati
import { domandeDelQuiz } from '../../data/quiz.js';
import { campiContatto } from '../../data/datiContatto.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }

  const { risposte, contatti, partial } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  if (partial) {
    // invio parziale: solo contatti
    const mancanti = campiContatto
      .filter(c => c.required)
      .map(c => c.id)
      .filter(id => !contatti?.[id] || contatti[id].trim() === '');

    if (mancanti.length) {
      return res
        .status(400)
        .json({ message: `Campi mancanti: ${mancanti.join(', ')}` });
    }

    const htmlContatti = campiContatto
      .map(
        f =>
          `<p><strong>${f.label}:</strong> ${contatti[f.id] || ''}</p>`
      )
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Nuova azienda – solo contatti',
      html: `<h1>Dati di contatto</h1>${htmlContatti}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res
        .status(200)
        .json({ message: 'Email parziale (contatti) inviata con successo!' });
    } catch (error) {
      console.error('Errore invio email parziale:', error);
      return res
        .status(500)
        .json({ message: 'Errore durante l\'invio dell\'email parziale.' });
    }
  }

  // invio completo: contatti + risposte + domande importate
  if (!contatti || !risposte) {
    return res
      .status(400)
      .json({ message: 'Dati incompleti per l\'invio completo.' });
  }

  const mailOptions = generaContenutoEmail({
    domande: domandeDelQuiz,
    risposte,
    contatti,
    campi: campiContatto,
  });

  try {
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: 'Email inviata con successo!' });
  } catch (error) {
    console.error('Errore invio email completa:', error);
    return res
      .status(500)
      .json({ message: 'Errore durante l\'invio dell\'email completa.' });
  }
}
