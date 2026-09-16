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
    const field = create('div', 'idea-detail-field');
    field.append(create('small', '', label), create('span', '', value));
    return field;
  }

  function mount(root, slide) {
    const config = slide.interaction || {};
    const stages = config.stages || [];
    const state = { started: false, revealed: 0 };

    root.innerHTML = '';
    root.classList.add('idea-product-interaction');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Simulation interactive : transformer une idée en outil');

    const heading = create('div', 'interaction-mission');
    heading.append(
      create('span', 'interaction-kicker', 'IDEA → PRODUCT'),
      create('strong', 'interaction-mission-text', config.sentence)
    );
    const artifact = create('div', 'idea-artifact');
    artifact.append(create('small', '', 'MÊME ARTEFACT'), create('strong', '', config.artifact));
    heading.append(artifact);
    root.append(heading);

    const stageList = create('ol', 'idea-stage-list');
    const stageItems = stages.map((stage, index) => {
      const item = create('li', 'idea-stage');
      const header = create('div', 'idea-stage-header');
      header.append(
        create('span', 'idea-stage-number', String(index + 1).padStart(2, '0')),
        create('strong', 'idea-stage-label', stage.label),
        create('em', 'idea-stage-state', 'À venir')
      );
      const detail = create('div', 'idea-stage-detail');
      detail.append(
        detailField('SORTIE', stage.output),
        detailField('PREUVE', stage.proof),
        detailField('VALIDATION', stage.validation)
      );
      item.append(header, detail);
      stageList.append(item);
      return { item, detail, state: header.querySelector('.idea-stage-state') };
    });
    root.append(stageList);

    const final = create('div', 'idea-final-result');
    final.append(
      create('span', 'interaction-kicker', 'RÉSULTAT'),
      create('strong', '', config.finalResult),
      create('small', '', 'La preuve s’accumule avant que l’outil devienne utilisable.')
    );
    root.append(final);

    const liveStatus = create('p', 'interaction-live-status idea-live-status');
    liveStatus.setAttribute('role', 'status');
    liveStatus.setAttribute('aria-live', 'polite');
    root.append(liveStatus);

    const actions = create('div', 'interaction-actions idea-actions');
    const launchButton = create('button', 'interaction-button interaction-button-primary', 'FAIRE ÉVOLUER L’ARTEFACT');
    launchButton.type = 'button';
    const revealButton = create('button', 'interaction-button', 'RÉVÉLER L’ÉTAPE SUIVANTE');
    revealButton.type = 'button';
    actions.append(launchButton, revealButton);
    root.append(actions);

    function render() {
      const complete = state.started && state.revealed >= stages.length;
      root.dataset.phase = !state.started ? 'idle' : complete ? 'complete' : 'running';
      launchButton.hidden = state.started && !complete;
      launchButton.textContent = complete ? 'REJOUER LE PARCOURS' : 'FAIRE ÉVOLUER L’ARTEFACT';
      revealButton.hidden = !state.started || complete;
      final.hidden = !complete;
      if (!state.started) {
        liveStatus.textContent = 'Une intention seule ne produit pas encore un outil.';
      } else if (complete) {
        liveStatus.textContent = 'Parcours terminé · outil testable, preuves visibles, validation humaine maintenue.';
      } else {
        liveStatus.textContent = `${state.revealed}/${stages.length} étapes · ${stages[state.revealed - 1].label} vient de produire un artefact.`;
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
        root.classList.remove('idea-product-interaction');
        root.removeAttribute('role');
        root.removeAttribute('aria-label');
        delete root.dataset.phase;
      }
    };
  }

  registry['idea-product'] = { mount };
})();
