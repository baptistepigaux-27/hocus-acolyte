(() => {
  'use strict';

  const registry = window.ACOLYTE_INTERACTIONS || (window.ACOLYTE_INTERACTIONS = {});

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function detailField(label, value) {
    const field = create('div', 'handoff-detail-field');
    field.append(create('small', '', label), create('span', '', value));
    return field;
  }

  function mount(root, slide) {
    const config = slide.interaction || {};
    const stages = config.stages || [];
    const state = { started: false, revealed: 0 };

    root.innerHTML = '';
    root.classList.add('handoff-interaction');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Simulation interactive : handoff entre les outils');

    const heading = create('div', 'interaction-mission');
    heading.append(
      create('span', 'interaction-kicker', 'UN SEUL ARTEFACT'),
      create('strong', 'interaction-mission-text', config.mission)
    );
    const artifact = create('div', 'handoff-artifact');
    artifact.append(
      create('small', '', 'ARTEFACT EN CIRCULATION'),
      create('strong', '', config.artifact.name),
      create('span', '', config.artifact.id)
    );
    heading.append(artifact);
    root.append(heading);

    const flow = create('ol', 'handoff-stage-list');
    const stageItems = stages.map((stage, index) => {
      const item = create('li', 'handoff-stage');
      const header = create('div', 'handoff-stage-header');
      header.append(
        create('span', 'handoff-stage-number', String(index + 1).padStart(2, '0')),
        create('strong', 'handoff-stage-actor', stage.actor),
        create('em', 'handoff-stage-state', 'À venir')
      );
      const detail = create('div', 'handoff-stage-detail');
      const identity = create('span', 'handoff-stage-artifact', `${config.artifact.name} · ${config.artifact.id}`);
      detail.append(identity, detailField('ENTRÉE', stage.input), detailField('SORTIE', stage.output), detailField('PREUVE', stage.proof), detailField('PERMISSION', stage.permission));
      item.append(header, detail);
      flow.append(item);
      return { item, detail, state: header.querySelector('.handoff-stage-state') };
    });
    root.append(flow);

    const liveStatus = create('p', 'interaction-live-status handoff-live-status');
    liveStatus.setAttribute('role', 'status');
    liveStatus.setAttribute('aria-live', 'polite');
    root.append(liveStatus);

    const actions = create('div', 'interaction-actions handoff-actions');
    const launchButton = create('button', 'interaction-button interaction-button-primary', 'LANCER LE HANDOFF');
    launchButton.type = 'button';
    const revealButton = create('button', 'interaction-button', 'FAIRE SUIVRE L’ARTEFACT');
    revealButton.type = 'button';
    actions.append(launchButton, revealButton);
    root.append(actions);

    function render() {
      const complete = state.started && state.revealed >= stages.length;
      root.dataset.phase = !state.started ? 'idle' : complete ? 'complete' : 'running';
      launchButton.hidden = state.started && !complete;
      launchButton.textContent = complete ? 'REJOUER LE HANDOFF' : 'LANCER LE HANDOFF';
      revealButton.hidden = !state.started || complete;
      if (!state.started) {
        liveStatus.textContent = 'Le même brief attend de passer d’un rôle au suivant.';
      } else if (complete) {
        liveStatus.textContent = 'Artefact arrivé en staging · validation humaine requise avant production.';
      } else {
        liveStatus.textContent = `${state.revealed}/${stages.length} étapes · ${stages[state.revealed - 1].actor} vient de recevoir l’artefact.`;
      }
      stageItems.forEach(({ item, detail, state: stateLabel }, index) => {
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
      if (state.started && state.revealed >= stages.length) {
        state.started = false;
        state.revealed = 0;
      } else {
        state.started = true;
        state.revealed = 1;
      }
      render();
    });
    revealButton.addEventListener('click', () => {
      if (state.started) {
        state.revealed = Math.min(stages.length, state.revealed + 1);
        render();
      }
    });

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.classList.remove('handoff-interaction');
        root.removeAttribute('role');
        root.removeAttribute('aria-label');
        delete root.dataset.phase;
      }
    };
  }

  registry.handoff = { mount };
})();
