import { useState } from 'react';
import { domandeDelQuiz } from '../data/quiz.js';
import { campiContatto } from '../data/datiContatto.js';
import Image from 'next/image';
import Footer from '../components/Footer.js';

const allSteps = [
  // prima tutti i campi di contatto
  ...campiContatto.map(item => ({ ...item, type: 'contact' })),
  // poi le domande del quiz
  ...domandeDelQuiz.map(item => ({ ...item, type: 'quiz' })),
];

export default function HomePage() {
  console.log(allSteps);
  const contactCount = campiContatto.length;
  const quizCount    = domandeDelQuiz.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [risposte, setRisposte] = useState({});
  const [contatti, setContatti] = useState({});
  const [status, setStatus] = useState('idle');
  const [partialSent, setPartialSent] = useState(false);


  const getVisibleSteps = () =>
    allSteps.filter(step => {
      if (!step.mostraSe) return true;
      return risposte[step.mostraSe.id] === step.mostraSe.valore;
    });

  const visibleSteps = getVisibleSteps();
  const currentStepData = visibleSteps[currentStep];
  const isLastStep = currentStep === visibleSteps.length - 1;

  // funzione che invia l'email parziale (solo contatti)
  const sendPartialEmail = (contattiPayload) => {
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contatti: contattiPayload, partial: true }),
    }).catch(console.error);
  };

  const handleContattoChange = (e) => {
    const { name, value } = e.target;
    // aggiorniamo contatti e verifichiamo subito se sono tutti compilati
    const updated = { ...contatti, [name]: value };
    setContatti(updated);

    if (!partialSent) {
      const allFilled = campiContatto.every(c => updated[c.id] && updated[c.id].trim() !== '');
      if (allFilled) {
        sendPartialEmail(updated);
        setPartialSent(true);
      }
    }
  };

  const handleSceltaRisposta = (id, opzione) => {
    const step = visibleSteps.find(s => s.id === id);
    if (step.multipla) {
      const arr = risposte[id] || [];
      const updated = arr.includes(opzione)
        ? arr.filter(x => x !== opzione)
        : [...arr, opzione];
      setRisposte({ ...risposte, [id]: updated });
    } else {
      setRisposte({ ...risposte, [id]: opzione });
    }
  };

const handleNext = () => {
  const step = visibleSteps[currentStep];

  if (step.type === 'contact') {
    const valore = contatti[step.id] || '';
    if (step.required && valore.trim() === '') {
      alert(`Per favore, compila il campo “${step.label}”.`);
      return;
    }
    if (step.validation && !step.validation.regex.test(valore)) {
      alert(step.validation.errorMessage);
      return;
    }
  } else {
    // quiz
    const resp = risposte[step.id];
    if (
      (step.multipla && (!Array.isArray(resp) || resp.length === 0)) ||
      (!step.multipla && !resp)
    ) {
      alert('Per favore, fornisci una risposta per continuare.');
      return;
    }
  }

  if (currentStep < visibleSteps.length - 1) {
    setCurrentStep(currentStep + 1);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLastStep) {
      handleNext();
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contatti, risposte, partial: false }),
      });
      if (!response.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

const getProgressPercentage = () => {
  const totalLogical = quizCount + 1;  // 1 = blocco contatti
  let completed = 0;

  // se hanno finito tutti i contatti, quel blocco vale 1
  if (partialSent) {
    completed = 1;
  }

  // se siamo dentro il quiz, aggiungo le domande già “navigate”
  if (currentStep >= contactCount) {
    // currentStep - contactCount = quante domande abbiamo fatto partire (0-based)
    // +1 perché voglio che la prima domanda già valga 2 tappe: contatti + prima domanda
    completed = 1 + (currentStep - contactCount + 1);
  }

  // non supero mai totalLogical
  completed = Math.min(completed, totalLogical);

  return (completed / totalLogical) * 100;
};

  if (status === 'success') {
    return (
      <div className="page-wrapper">
        <main className="container">
          <div className="question-box finalBox">
            <Image src="/checked.png" alt="Conferma" width={64} height={64} className="checked-image" />
            <h2 className="question-title finalTitle">Grazie!</h2>
            <p className="lightP">
              La tua candidatura è stata ricevuta. Ti contatteremo al più presto.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${getProgressPercentage()}%` }} />
      </div>

      <main className="container">
        <form onSubmit={handleSubmit} className="quiz-form">
          {currentStepData.type === 'contact' && (
            <>
              <h2 className="contact-section-title">Inserisci i dati della tua azienda</h2>
              <div className="question-box">
                <label htmlFor={currentStepData.id} className="question-title">
                  {currentStepData.label}
                </label>
                <input
                  type={currentStepData.type}
                  id={currentStepData.id}
                  name={currentStepData.id}
                  className="input-contact"
                  placeholder={currentStepData.placeholder}
                  value={contatti[currentStepData.id] || ''}
                  onChange={handleContattoChange}
                  required={currentStepData.required}
                />
              </div>
            </>
          )}

          {currentStepData.type === 'quiz' && (
            <div className="question-box">
              <h2 className="question-title">{currentStepData.testo}</h2>
              {currentStepData.multipla
                ? currentStepData.opzioni.map(opzione => (
                    <label key={opzione} className="radio-option">
                      <input
                        type="checkbox"
                        name={`${currentStepData.id}-${opzione}`}
                        value={opzione}
                        onChange={() => handleSceltaRisposta(currentStepData.id, opzione)}
                        checked={risposte[currentStepData.id]?.includes(opzione) || false}
                      />
                      <span>{opzione}</span>
                    </label>
                  ))
                : currentStepData.opzioni.map(opzione => (
                    <label key={opzione} className="radio-option">
                      <input
                        type="radio"
                        name={currentStepData.id}
                        value={opzione}
                        onChange={() => handleSceltaRisposta(currentStepData.id, opzione)}
                        checked={risposte[currentStepData.id] === opzione}
                        required
                      />
                      <span>{opzione}</span>
                    </label>
                  ))}
            </div>
          )}

          <div className="button-container">
            {isLastStep ? (
              <button type="submit" className="submit-button" disabled={status === 'sending'}>
                {status === 'sending' ? 'Invio in corso...' : 'Invia Risposte'}
              </button>
            ) : (
              <button type="button" className="next-button" onClick={handleNext}>
                Prossimo
              </button>
            )}
          </div>
        </form>

        {status === 'error' && <p>Errore nell&lsquo;invio. Riprova più tardi.</p>}
      </main>

      <Footer />
    </div>
  );
}
