export function generaContenutoEmail({ domande, risposte, contatti, campi }) {
  
  const sezioneContattiHtml = `
    <div>
      <h3>Dati di Contatto</h3>
      <ul>
        ${campi.map(campo => `
          <li>
            <strong>${campo.label}:</strong> ${contatti[campo.id] || 'Non fornito'}
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  const sezioneQuizHtml = `
    <div>
      <h3>Risultati del Quiz</h3>
      <ul>
        ${domande.map(domanda => `
          <li>
            <strong>${domanda.testo}</strong><br>
            <span>${risposte[domanda.id] || 'Non fornita'}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  const corpoHtml = `
    <div>
      <h2>Nuova compilazione del Quiz di Idoneità!</h2>
      ${sezioneContattiHtml}
      ${sezioneQuizHtml}
      <hr>
      <p>Messaggio inviato automaticamente dalla landing page.</p>
    </div>
  `;

  const corpoTesto = `
    Nuova compilazione del Quiz di Idoneità!\n
    --- Dati di Contatto ---\n
    ${campi.map(campo => `${campo.label}: ${contatti[campo.id] || 'Non fornito'}\n`).join('')}
    \n--- Risultati del Quiz ---\n
    ${domande.map(domanda => `- ${domanda.testo}\n  Risposta: ${risposte[domanda.id] || 'Non fornita'}\n`).join('\n')}
  `;

  return {
    from: `"Notifiche Quiz Bando" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `✅ Nuova Candidatura da ${contatti.nomeAzienda || 'un\'azienda'}`,
    text: corpoTesto,
    html: corpoHtml,
  };
}