import { useState } from 'react';
import { domandeDelQuiz } from '../data/quiz.js';
import { campiContatto } from '../data/datiContatto.js';
import Image from 'next/image';
import Footer from '../components/Footer.js';

const allSteps = [
  ...domandeDelQuiz.map(item => ({ ...item, type: 'quiz' })),
  ...campiContatto.map(item => ({ ...item, type: 'contact' })),
];

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [risposte, setRisposte] = useState({});
  const [contatti, setContatti] = useState({});
  const [status, setStatus] = useState('idle');

  const getVisibleSteps = () => {
    return allSteps.filter(step => {
      if (!step.mostraSe) return true;
      const risposta = risposte[step.mostraSe.id];
      return risposta === step.mostraSe.valore;
    });
  };

  const visibleSteps = getVisibleSteps();
  const currentStepData = visibleSteps[currentStep];
  const isLastStep = currentStep === visibleSteps.length - 1;

  const handleSceltaRisposta = (idDomanda, opzione) => {
    const step = visibleSteps.find(s => s.id === idDomanda);
    if (step.multipla) {
      const rispostaAttuale = risposte[idDomanda] || [];
      const nuovaRisposta = rispostaAttuale.includes(opzione)
        ? rispostaAttuale.filter(r => r !== opzione)
        : [...rispostaAttuale, opzione];
      setRisposte({ ...risposte, [idDomanda]: nuovaRisposta });
    } else {
      setRisposte({ ...risposte, [idDomanda]: opzione });
    }
  };

  const handleContattoChange = (e) => {
    const { name, value } = e.target;
    setContatti({ ...contatti, [name]: value });
  };

  const handleNext = () => {
    const stepData = visibleSteps[currentStep];

    if (stepData.type === 'quiz') {
      const risposta = risposte[stepData.id];
      if (
        (stepData.multipla && (!risposta || risposta.length === 0)) ||
        (!stepData.multipla && !risposta)
      ) {
        alert('Per favore, fornisci una risposta per continuare.');
        return;
      }
    }

    if (stepData.type === 'contact') {
      const valoreUtente = contatti[stepData.id];
      if (stepData.required && !valoreUtente) {
        alert(`Per favore, compila il campo "${stepData.label}".`);
        return;
      }
      if (stepData.validation && valoreUtente && !stepData.validation.regex.test(valoreUtente)) {
        alert(stepData.validation.errorMessage);
        return;
      }
    }

    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLastStep) {
      handleNext();
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          risposte,
          domande: domandeDelQuiz,
          contatti,
          campi: campiContatto,
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        throw new Error('La richiesta al server è fallita.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const getProgressPercentage = () => {
    const quizLength = visibleSteps.filter(s => s.type === 'quiz').length;
    const contactSteps = visibleSteps.filter(s => s.type === 'contact').length;
    const totalLogicalSteps = quizLength + 1;

    let logicalProgress = 0;

    if (currentStep < quizLength) {
      logicalProgress = currentStep;
    } else {
      const contactIndex = currentStep - quizLength;
      logicalProgress = quizLength + (contactIndex + 1) / contactSteps;
    }

    return (logicalProgress / totalLogicalSteps) * 100;
  };

  if (status === 'success') {
    return (
      <div className="page-wrapper">
        <main className="container">
          <div className="question-box finalBox">
            <Image
              src="/checked.png"
              alt="Conferma invio"
              width={64}
              height={64}
              className="checked-image"
            />
            <h2 className="question-title finalTitle">Grazie!</h2>
            <p className="lightP">
              La tua candidatura è stata ricevuta. Un nostro consulente ti contatterà
              al più presto all&rsquo;indirizzo email fornito.
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
        <div
          className="progress-bar-fill"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      <main className="container">
        <form onSubmit={handleSubmit} className="quiz-form">
          {currentStepData.type === 'quiz' && (
            <div className="question-box">
              <h2 className="question-title">{currentStepData.testo}</h2>

          {currentStepData.multipla
            ? currentStepData.opzioni.map((opzione) => (
                <label key={opzione} className="radio-option">
                  <input
                    type="checkbox"
                    name={`${currentStepData.id}-${opzione}`}
                    value={opzione}
                    onChange={() =>
                      handleSceltaRisposta(currentStepData.id, opzione)
                    }
                    checked={
                      Array.isArray(risposte[currentStepData.id]) &&
                      risposte[currentStepData.id].includes(opzione)
                    }
                  />
                  <span>{opzione}</span>
                </label>
              ))
            : currentStepData.opzioni.map((opzione) => (
                <label key={opzione} className="radio-option">
                  <input
                    type="radio"
                    name={currentStepData.id}
                    value={opzione}
                    onChange={() =>
                      handleSceltaRisposta(currentStepData.id, opzione)
                    }
                    checked={risposte[currentStepData.id] === opzione}
                    required
                  />
                  <span>{opzione}</span>
                </label>
              ))}

            </div>
          )}

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



          <div className="button-container">
            {isLastStep ? (
              <button
                type="submit"
                className="submit-button"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Invio in corso...' : 'Invia Risposte'}
              </button>
            ) : (
              <button type="button" className="next-button" onClick={handleNext}>
                Prossimo
              </button>
            )}
          </div>
        </form>

        {status === 'error' && (
          <p>Si è verificato un errore. Riprova più tardi.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
