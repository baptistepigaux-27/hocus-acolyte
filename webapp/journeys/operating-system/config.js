(() => {
  'use strict';

  const journeys = window.ACOLYTE_JOURNEYS || (window.ACOLYTE_JOURNEYS = {});

  journeys['operating-system'] = {
    config: {
      key: 'operating-system',
      shortLabel: 'SYSTÈME DE TRAVAIL',
      label: 'Du chatbot au système de travail',
      description: 'Comprendre contexte, mémoire, outils, agents et workflows.'
    },
    slides: window.ACOLYTE_SLIDES || []
  };
})();
