(() => {
  'use strict';

  const registry = window.ACOLYTE_INTERACTIONS || (window.ACOLYTE_INTERACTIONS = {});

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  const steps = [
    ['CRM', 'contexte client'],
    ['EMAILS', 'échanges récents'],
    ['WEB / DATA', 'signaux utiles'],
    ['ANALYSE', 'faits et écarts'],
    ['BRIEFING', 'questions et prochaines actions'],
    ['VALIDATION HUMAINE', 'avant contact ou engagement']
  ];

  function mount(root) {
    const state = { revealed: 0 };
    root.innerHTML = '';
    root.className = 'agent-business-interaction';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Simulation d’un agent de préparation commerciale');

    const heading = create('div', 'agent-business-heading');
    heading.append(create('span', 'interaction-kicker', 'AGENT MÉTIER'), create('strong', '', 'Prépare mon rendez-vous commercial de demain.'));
    root.append(heading);
    const stepList = create('div', 'agent-business-steps');
    root.append(stepList);
    const actions = create('div', 'interaction-actions agent-business-actions');
    const advance = create('button', 'interaction-button interaction-button-primary', 'LANCER LA PRÉPARATION');
    advance.type = 'button';
    advance.addEventListener('click', () => {
      if (state.revealed < steps.length) state.revealed += 1;
      render();
    });
    const reset = create('button', 'interaction-button', 'RÉINITIALISER');
    reset.type = 'button';
    reset.hidden = true;
    reset.addEventListener('click', () => {
      state.revealed = 0;
      render();
    });
    actions.append(advance, reset);
    root.append(actions);
    const status = create('p', 'interaction-live-status agent-business-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.append(status);

    function render() {
      stepList.replaceChildren();
      steps.forEach(([label, detail], index) => {
        const stateName = index < state.revealed ? 'done' : index === state.revealed ? 'active' : 'upcoming';
        const item = create('div', 'agent-business-step');
        item.dataset.state = stateName;
        item.append(create('span', '', String(index + 1).padStart(2, '0')), create('strong', '', label), create('small', '', detail));
        if (index < state.revealed) item.append(create('i', '', '✓'));
        stepList.append(item);
      });
      const complete = state.revealed >= steps.length;
      advance.textContent = state.revealed === 0 ? 'LANCER LA PRÉPARATION' : complete ? 'PRÉPARATION TERMINÉE' : 'RÉVÉLER L’ÉTAPE SUIVANTE';
      advance.disabled = complete;
      reset.hidden = !complete;
      status.textContent = complete
        ? 'Briefing prêt · validation humaine obligatoire avant toute action conséquente.'
        : state.revealed === 0
          ? 'Agent en attente · les sources resteront dans un périmètre autorisé.'
          : `${state.revealed} étape${state.revealed > 1 ? 's' : ''} révélée${state.revealed > 1 ? 's' : ''} · prochaine étape bornée.`;
    }

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.className = '';
      }
    };
  }

  registry['agent-business'] = { mount };
})();
