export const campiContatto = [
{
    id: 'partitaIva',
    label: 'Partita IVA',
    type: 'text',
    placeholder: 'Es. IT01234567890',
    required: true,
    validation: {
      regex: /^([A-Z]{2})?\d{11}$/,
      errorMessage: 'Formato Partita IVA non valido (es. IT12345678901).',
    },
  },
  {
    id: 'email',
    label: 'Indirizzo Email',
    type: 'email',
    placeholder: 'info@tuaazienda.com',
    required: true,
  },
  {
    id: 'telefono',
    label: 'Numero di telefono di riferimento',
    type: 'tel',
    placeholder: 'Numero di telefono',
    required: true,
  },
];