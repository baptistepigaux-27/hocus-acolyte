(() => {
  'use strict';

  window.ACOLYTE_PME_SOLUTIONS = [
    {
      key: 'general-copilots',
      family: 'COPILOTES',
      description: 'Aider une personne à comprendre, rédiger, analyser ou préparer.',
      modes: ['BUY'],
      examples: ['ChatGPT Business', 'Microsoft 365 Copilot', 'Gemini', 'Claude']
    },
    {
      key: 'knowledge',
      family: 'KNOWLEDGE / SEARCH',
      description: 'Retrouver la connaissance de l’entreprise et répondre avec des sources.',
      modes: ['BUY', 'CONFIGURE', 'BUILD'],
      examples: ['Copilot connecté aux sources', 'Glean', 'Notion AI', 'moteur documentaire dédié']
    },
    {
      key: 'automation',
      family: 'AUTOMATION / WORKFLOW',
      description: 'Connecter des systèmes et automatiser une chaîne dont les règles sont connues.',
      modes: ['BUY', 'CONFIGURE'],
      examples: ['n8n', 'Make', 'Power Automate', 'Zapier', 'UiPath']
    },
    {
      key: 'agents',
      family: 'AGENTS MÉTIER',
      description: 'Poursuivre un objectif en choisissant plusieurs étapes dans un cadre donné.',
      modes: ['BUY', 'CONFIGURE', 'BUILD'],
      examples: ['agent CRM', 'agent SAV', 'agent custom']
    },
    {
      key: 'app-builders',
      family: 'APP BUILDERS / CUSTOM',
      description: 'Créer une capacité métier récurrente, mesurable et spécifique.',
      modes: ['CONFIGURE', 'BUILD'],
      examples: ['Retool', 'Power Apps', 'API + LLM + base de données', 'développement custom']
    }
  ];
})();
