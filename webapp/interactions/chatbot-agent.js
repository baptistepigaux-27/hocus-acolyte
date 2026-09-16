(() => {
  'use strict';

  const registry = window.ACOLYTE_INTERACTIONS || (window.ACOLYTE_INTERACTIONS = {});

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function field(label, value) {
    const item = create('div', 'agent-detail-field');
    item.append(create('small', '', label), create('span', '', value));
    return item;
  }

  function mount(root, slide) {
    const config = slide.interaction || {};
    const steps = config.steps || [];
    const state = { started: false, revealed: 0 };

    root.innerHTML = '';
    root.classList.add('chatbot-agent-interaction');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Simulation interactive : chatbot contre agent');

    const mission = create('div', 'interaction-mission');
    mission.append(
      create('span', 'interaction-kicker', 'MISSION COMMUNE'),
      create('strong', 'interaction-mission-text', config.mission)
    );
    root.append(mission);

    const columns = create('div', 'interaction-columns');
    const chatbotPanel = create('section', 'interaction-panel interaction-chatbot');
    chatbotPanel.setAttribute('aria-labelledby', 'chatbot-panel-title');
    const chatbotHeader = create('div', 'interaction-panel-header');
    chatbotHeader.append(
      create('span', 'interaction-panel-kicker', 'UNE SORTIE'),
      create('h3', 'interaction-panel-title', 'CHATBOT')
    );
    chatbotHeader.querySelector('h3').id = 'chatbot-panel-title';
    chatbotPanel.append(chatbotHeader);

    const chatbotQuestion = create('div', 'interaction-question');
    chatbotQuestion.append(
      create('small', '', 'QUESTION'),
      create('p', '', config.mission)
    );
    chatbotPanel.append(chatbotQuestion);

    const chatbotResponse = create('div', 'chatbot-response');
    chatbotResponse.append(
      create('small', '', 'RÉPONSE'),
      create('p', '', config.chatbotResponse)
    );
    chatbotPanel.append(chatbotResponse);

    const chatbotLesson = create('p', 'interaction-lesson', 'Une réponse utile, mais sans étapes visibles.');
    chatbotPanel.append(chatbotLesson);
    columns.append(chatbotPanel);

    const agentPanel = create('section', 'interaction-panel interaction-agent');
    agentPanel.setAttribute('aria-labelledby', 'agent-panel-title');
    const agentHeader = create('div', 'interaction-panel-header');
    agentHeader.append(
      create('span', 'interaction-panel-kicker', 'OBJECTIF + BOUCLE'),
      create('h3', 'interaction-panel-title', 'AGENT')
    );
    agentHeader.querySelector('h3').id = 'agent-panel-title';
    agentPanel.append(agentHeader);

    const agentStatus = create('p', 'agent-status');
    agentStatus.setAttribute('aria-live', 'polite');
    agentPanel.append(agentStatus);

    const stepList = create('ol', 'agent-step-list');
    const stepItems = steps.map((step, index) => {
      const item = create('li', 'agent-step');
      const head = create('div', 'agent-step-head');
      head.append(
        create('span', 'agent-step-number', String(index + 1).padStart(2, '0')),
        create('strong', 'agent-step-label', step.label),
        create('em', 'agent-step-state', 'À venir')
      );
      const detail = create('div', 'agent-step-detail');
      detail.append(
        field('OUTIL', step.tool),
        field('OBSERVATION', step.observation),
        field('PREUVE', step.proof)
      );
      item.append(head, detail);
      stepList.append(item);
      return { item, detail, state: head.querySelector('.agent-step-state') };
    });
    agentPanel.append(stepList);

    const permissionRail = create('div', 'interaction-permissions');
    (config.permissions || []).forEach((permission) => {
      const item = create('div', `interaction-permission ${permission.tone || ''}`);
      item.append(create('small', '', permission.label), create('span', '', permission.value));
      permissionRail.append(item);
    });
    agentPanel.append(permissionRail);
    columns.append(agentPanel);
    root.append(columns);

    const finalResult = create('div', 'agent-final-result');
    finalResult.append(
      create('span', 'interaction-kicker', 'SORTIE AGENT'),
      create('strong', '', config.finalResult),
      create('small', '', 'Validation humaine requise avant toute action conséquente.')
    );
    root.append(finalResult);

    const actions = create('div', 'interaction-actions');
    const launchButton = create('button', 'interaction-button interaction-button-primary', 'LANCER LA MISSION');
    launchButton.type = 'button';
    const revealButton = create('button', 'interaction-button', 'RÉVÉLER L’ÉTAPE SUIVANTE');
    revealButton.type = 'button';
    const liveStatus = create('p', 'interaction-live-status');
    liveStatus.setAttribute('role', 'status');
    liveStatus.setAttribute('aria-live', 'polite');
    actions.append(launchButton, revealButton, liveStatus);
    root.append(actions);

    function render() {
      const complete = state.started && state.revealed >= steps.length;
      root.dataset.phase = !state.started ? 'idle' : complete ? 'complete' : 'running';
      chatbotResponse.classList.toggle('is-emphasized', state.started);
      launchButton.hidden = state.started && !complete;
      launchButton.textContent = complete ? 'REJOUER LA MISSION' : 'LANCER LA MISSION';
      revealButton.hidden = !state.started || complete;
      revealButton.textContent = state.revealed < steps.length ? 'RÉVÉLER L’ÉTAPE SUIVANTE' : 'TERMINER';
      finalResult.hidden = !complete;

      if (!state.started) {
        agentStatus.textContent = 'En attente de la mission · 0 étape révélée.';
        liveStatus.textContent = 'Lancez la mission pour observer la boucle agent.';
      } else if (complete) {
        agentStatus.textContent = `Mission terminée · ${steps.length} étapes prises en charge.`;
        liveStatus.textContent = 'La recommandation est prête à être relue et validée par un humain.';
      } else {
        const activeStep = steps[state.revealed - 1];
        agentStatus.textContent = `Mission en cours · ${state.revealed}/${steps.length} étapes révélées · ${activeStep.label}.`;
        liveStatus.textContent = `Étape ${state.revealed} révélée : ${activeStep.label}. Continuez pour voir la suite.`;
      }

      stepItems.forEach(({ item, detail, state: stateLabel }, index) => {
        const revealed = state.started && index < state.revealed;
        const active = revealed && !complete && index === state.revealed - 1;
        item.dataset.state = !revealed ? 'upcoming' : active ? 'active' : 'done';
        detail.hidden = !revealed;
        stateLabel.textContent = !revealed ? 'À venir' : active ? 'En cours' : 'Fait';
        if (active) item.setAttribute('aria-current', 'step');
        else item.removeAttribute('aria-current');
      });
    }

    launchButton.addEventListener('click', () => {
      if (state.started && state.revealed >= steps.length) {
        state.started = false;
        state.revealed = 0;
      } else {
        state.started = true;
        state.revealed = 1;
      }
      render();
    });

    revealButton.addEventListener('click', () => {
      if (!state.started) return;
      state.revealed = Math.min(steps.length, state.revealed + 1);
      render();
    });

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.classList.remove('chatbot-agent-interaction');
        root.removeAttribute('role');
        root.removeAttribute('aria-label');
        delete root.dataset.phase;
      }
    };
  }

  registry['chatbot-agent'] = { mount };
})();
