(() => {
  'use strict';

  const registry = window.ACOLYTE_INTERACTIONS || (window.ACOLYTE_INTERACTIONS = {});

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function mount(root, slide) {
    const solutions = slide.interaction?.solutions || [];
    const state = { mode: 'with' };
    root.innerHTML = '';
    root.className = 'knowledge-journey-interaction';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Démonstration de connaissance d’entreprise');

    const heading = create('div', 'knowledge-journey-heading');
    heading.append(create('span', 'interaction-kicker', 'CONNAISSANCE D’ENTREPRISE'), create('strong', '', 'Une réponse utile laisse une trace vérifiable.'));
    root.append(heading);

    const sourceRow = create('div', 'knowledge-source-row');
    ['DOCUMENTS', 'DONNÉES', 'DÉCISIONS', 'HISTORIQUE'].forEach((label) => sourceRow.append(create('span', '', label)));
    root.append(sourceRow, create('div', 'knowledge-arrow', '↓'), create('div', 'knowledge-search-node', 'RECHERCHE'));

    const controls = create('div', 'knowledge-mode-tabs');
    [['without', 'SANS CONNAISSANCE'], ['with', 'AVEC CONNAISSANCE']].forEach(([mode, label]) => {
      const button = create('button', 'knowledge-mode-button', label);
      button.type = 'button';
      button.dataset.mode = mode;
      button.setAttribute('aria-pressed', String(state.mode === mode));
      button.addEventListener('click', () => {
        state.mode = mode;
        render();
      });
      controls.append(button);
    });
    root.append(controls);

    const answer = create('section', 'knowledge-answer');
    root.append(answer);
    const solutionRow = create('div', 'knowledge-solution-row');
    root.append(solutionRow);
    const status = create('p', 'interaction-live-status knowledge-live-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.append(status);

    function render() {
      const contextual = state.mode === 'with';
      answer.replaceChildren(
        create('small', '', 'QUESTION'),
        create('strong', '', 'Avons-nous déjà répondu à ce type d’appel d’offres ?')
      );
      const response = create('div', `knowledge-response ${contextual ? 'is-contextual' : ''}`);
      response.append(create('small', '', contextual ? 'RÉPONSE SOURCÉE' : 'RÉPONSE GÉNÉRIQUE'));
      if (contextual) {
        response.append(create('strong', '', 'Oui · un projet similaire a été identifié.'));
        const evidence = create('div', 'knowledge-evidence');
        [['PROJET', 'référence 2024'], ['DÉCISION', 'go sous conditions'], ['SOURCE', 'AO-2024-17 · compte rendu']].forEach(([label, value]) => {
          evidence.append(create('span', '', `${label} · ${value}`));
        });
        response.append(evidence);
      } else {
        response.append(create('strong', '', 'Je peux proposer une méthode générale de recherche.'));
        response.append(create('span', '', 'Aucune source d’entreprise n’est disponible pour vérifier la réponse.'));
      }
      answer.append(response);

      solutionRow.replaceChildren();
      [['BUY', 'Commencer avec un copilote'], ['CONFIGURE', 'Connecter sources et droits'], ['BUILD', 'Créer une méthode propriétaire']].forEach(([mode, detail]) => {
        const card = create('div', `knowledge-solution-card knowledge-${mode.toLowerCase()}`);
        card.append(create('small', '', mode), create('span', '', detail));
        solutionRow.append(card);
      });
      [...controls.querySelectorAll('button')].forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === state.mode)));
      status.textContent = contextual ? 'Connaissance activée · réponse avec projet, décision et source.' : 'Sans connaissance · réponse générique, sans preuve d’entreprise.';
    }

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.className = '';
      }
    };
  }

  registry['knowledge-journey'] = { mount };
})();
