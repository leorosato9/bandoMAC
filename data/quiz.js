export const domandeDelQuiz = [
  {
    id: 'impresa_costituita',
    testo: '1. La tua impresa è già costituita?',
    opzioni: ['Sì', 'No']
  },
  {
    id: 'tempo_attivita',
    testo: 'Da quanto tempo è attiva?',
    opzioni: [
      'Meno di 12 mesi',
      'Tra 1 e 3 anni',
      'Tra 3 e 5 anni',
      'Più di 5 anni'
    ],
    mostraSe: { id: 'impresa_costituita', valore: 'Sì' }
  },
  {
    id: 'compagine_sociale',
    testo: 'La tua impresa ha una compagine sociale composta per oltre il 50% da:',
    opzioni: ['Donne', 'Under 36', 'Entrambi', 'Nessuno dei due']
  },
  {
    id: 'sul_mercato',
    testo: 'Il prodotto o servizio che intendi finanziare è già sul mercato?',
    opzioni: ['Sì, è già sul mercato', 'No, è ancora in fase di sviluppo']
  },
  {
    id: 'punto_attivita',
    testo: 'A che punto sei?',
    opzioni: [
      'Ho già clienti attivi e vendite regolari',
      'Ho effettuato vendite occasionali o in fase test',
      'Ho realizzato un prototipo ma non l’ho ancora commercializzato',
      'Altro'
    ],
    mostraSe: { id: 'sul_mercato', valore: 'Sì, è già sul mercato' }
  },
  {
    id: 'settore',
    testo: 'In quale settore opera la tua attività?',
    opzioni: [
      'Produzione industriale',
      'Artigianato',
      'Commercio',
      'Turismo',
      'Servizi innovativi o digitali',
      'Agricoltura',
      'Altro'
    ]
  },
  {
    id: 'idea_investimento',
    testo: 'Hai già un’idea chiara dell’investimento che vuoi realizzare?',
    opzioni: [
      'Sì, ho definito con precisione cosa finanziare',
      'Ho un’idea generale, ma non ancora dettagliata',
      'No, sto cercando ispirazione o supporto'
    ]
  },
  {
    id: 'tipo_investimento',
    testo: 'Che tipo di investimenti pensi siano necessari per realizzare e completare il progetto?',
    opzioni: [
      'Acquisto di attrezzature o macchinari',
      'Sviluppo software o digitalizzazione',
      'Assunzione di personale',
      'Affitto o ristrutturazione locali',
      'Comunicazione e marketing',
      'Nessun investimento, il prodotto è già pronto',
      'Altro'
    ],
    mostraSe: { id: 'idea_investimento', valore: 'Sì, ho definito con precisione cosa finanziare' },
    multipla: true
  },
  {
    id: 'business_plan',
    testo: 'Hai già un business plan, anche semplificato?',
    opzioni: ['Sì', 'No']
  },
  {
    id: 'budget',
    testo: 'A quanto ammonta, in modo approssimativo, il budget del tuo progetto?',
    opzioni: [
      'Fino a 150.000 €',
      'Tra 150.000 € e 500.000 €',
      'Tra 500.000 € e 1.500.000 €',
      'Tra 1.500.000 € e 3.000.000 €',
      'Oltre 3.000.000 €'
    ]
  },
  {
    id: 'cofinanziamento',
    testo: 'Sei in grado di co-finanziare parte del progetto o ti serve supporto anche in questa fase?',
    opzioni: [
      'Ho già i fondi necessari per anticipare alcune spese',
      'Posso attivare co-finanziamenti (es. banca, soci, strumenti privati)',
      'Non ho ancora disponibilità e cerco supporto anche per questa fase'
    ]
  }
];
