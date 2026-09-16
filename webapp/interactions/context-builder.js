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
    const config = slide.interaction || {};
    const contexts = config.contexts || [];
    const selected = new Set();

    root.innerHTML = '';
    root.classList.add('context-builder-interaction');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Simulation interactive : construire le contexte');

    const heading = create('div', 'interaction-mission');
    heading.append(
      create('span', 'interaction-kicker', 'CONTEXT BUILDER'),
      create('strong', 'interaction-mission-text', config.prompt)
    );
    root.append(heading);

    const columns = create('div', 'context-builder-columns');
    const controls = create('section', 'interaction-panel context-controls');
    controls.setAttribute('aria-labelledby', 'context-controls-title');
    const controlsHeader = create('div', 'interaction-panel-header');
    controlsHeader.append(
      create('span', 'interaction-panel-kicker', 'ACTION'),
      create('h3', 'interaction-panel-title', 'AJOUTER DU CONTEXTE')
    );
    controlsHeader.querySelector('h3').id = 'context-controls-title';
    controls.append(controlsHeader);
    controls.append(create('p', 'context-controls-intro', 'Chaque brique réduit une part du flou et rend la sortie plus actionnable.'));

    const optionList = create('div', 'context-options');
    const optionItems = contexts.map((context) => {
      const button = create('button', 'context-option');
      button.type = 'button';
      button.dataset.contextKey = context.key;
      button.setAttribute('aria-pressed', 'false');
      const copy = create('span', 'context-option-copy');
      copy.append(create('strong', '', context.label), create('small', '', context.detail));
      button.append(copy, create('em', 'context-option-state', 'AJOUTER'));
      button.addEventListener('click', () => {
        if (selected.has(context.key)) selected.delete(context.key);
        else selected.add(context.key);
        render();
      });
      optionList.append(button);
      return { context, button, state: button.querySelector('.context-option-state') };
    });
    controls.append(optionList);

    const resetButton = create('button', 'interaction-button context-reset', 'RÉINITIALISER');
    resetButton.type = 'button';
    resetButton.addEventListener('click', () => {
      selected.clear();
      render();
    });
    controls.append(resetButton);
    columns.append(controls);

    const result = create('section', 'interaction-panel context-result');
    result.setAttribute('aria-labelledby', 'context-result-title');
    const resultHeader = create('div', 'interaction-panel-header');
    resultHeader.append(
      create('span', 'interaction-panel-kicker', 'OBSERVATION'),
      create('h3', 'interaction-panel-title', 'SORTIE')
    );
    resultHeader.querySelector('h3').id = 'context-result-title';
    result.append(resultHeader);

    const answer = create('div', 'context-answer');
    answer.append(create('small', '', 'RÉPONSE ÉVOLUTIVE'));
    const answerText = create('p');
    answer.append(answerText);
    result.append(answer);

    const findingBlock = create('div', 'context-finding-block');
    findingBlock.append(create('small', '', 'CE QUI APPARAÎT'));
    const findingList = create('ul', 'context-finding-list');
    findingBlock.append(findingList);
    result.append(findingBlock);

    const signalGrid = create('div', 'context-signal-grid');
    const signalAction = create('div', 'context-signal');
    signalAction.append(create('small', '', 'ACTION'), create('span'));
    const signalTool = create('div', 'context-signal');
    signalTool.append(create('small', '', 'OUTIL'), create('span'));
    const signalProof = create('div', 'context-signal');
    signalProof.append(create('small', '', 'PREUVE'), create('span'));
    signalGrid.append(signalAction, signalTool, signalProof);
    result.append(signalGrid);

    const unknowns = create('p', 'context-unknowns');
    result.append(unknowns);
    columns.append(result);
    root.append(columns);

    const liveStatus = create('p', 'interaction-live-status context-live-status');
    liveStatus.setAttribute('role', 'status');
    liveStatus.setAttribute('aria-live', 'polite');
    root.append(liveStatus);

    function render() {
      const chosen = contexts.filter((context) => selected.has(context.key));
      const latest = chosen[chosen.length - 1];
      const complete = chosen.length === contexts.length && contexts.length > 0;
      root.dataset.phase = complete ? 'complete' : chosen.length ? 'building' : 'base';
      answer.classList.toggle('is-emphasized', chosen.length > 0);
      answerText.textContent = latest ? latest.response : config.base.response;
      findingList.replaceChildren();
      const findings = chosen.length
        ? chosen.flatMap((context) => context.findings).slice(-4)
        : config.base.findings;
      findings.forEach((finding) => findingList.append(create('li', '', finding)));
      signalAction.querySelector('span').textContent = latest ? latest.action : 'Question seule · réponse générique';
      signalTool.querySelector('span').textContent = latest ? latest.tool : 'aucun contexte partagé';
      signalProof.querySelector('span').textContent = latest ? latest.proof : 'sortie non vérifiée';
      const missing = contexts.filter((context) => !selected.has(context.key)).map((context) => context.label);
      unknowns.textContent = complete
        ? 'Contexte de travail complet pour cette simulation · les faits restent à vérifier.'
        : `INCERTITUDES RESTANTES · ${missing.join(' · ') || config.base.unknowns}`;
      liveStatus.textContent = chosen.length
        ? `${chosen.length}/${contexts.length} briques ajoutées · ${latest.label}.`
        : 'Ajoutez une brique pour voir la réponse changer.';
      optionItems.forEach(({ context, button, state }) => {
        const isSelected = selected.has(context.key);
        button.setAttribute('aria-pressed', String(isSelected));
        button.classList.toggle('is-selected', isSelected);
        state.textContent = isSelected ? 'RETIRER' : 'AJOUTER';
      });
      resetButton.hidden = chosen.length === 0;
    }

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.classList.remove('context-builder-interaction');
        root.removeAttribute('role');
        root.removeAttribute('aria-label');
        delete root.dataset.phase;
      }
    };
  }

  registry['context-builder'] = { mount };
})();
