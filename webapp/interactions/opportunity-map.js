(() => {
  'use strict';

  const registry = window.ACOLYTE_INTERACTIONS || (window.ACOLYTE_INTERACTIONS = {});

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function textField(label, value, className = '') {
    const field = create('div', `opportunity-detail-field ${className}`.trim());
    field.append(create('small', '', label), create('p', '', value));
    return field;
  }

  function listField(label, values) {
    const field = create('div', 'opportunity-detail-field');
    field.append(create('small', '', label));
    const list = create('ul', 'opportunity-detail-list');
    values.forEach((value) => list.append(create('li', '', value)));
    field.append(list);
    return field;
  }

  function mount(root, slide) {
    const config = slide.interaction || {};
    const levels = config.levels || [];
    const functions = config.functions || [];
    const solutions = config.solutions || [];
    const state = {
      selectedFunction: config.defaultFunction || functions[0]?.key,
      selectedOpportunity: null
    };

    root.innerHTML = '';
    root.classList.add('opportunity-map-interaction');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Opportunity Map interactive : explorer les métiers');

    const heading = create('div', 'opportunity-map-heading');
    heading.append(
      create('span', 'interaction-kicker', 'OPPORTUNITY MAP'),
      create('strong', 'opportunity-map-title', 'Où l’IA peut-elle améliorer un travail important ?')
    );
    root.append(heading);

    const controls = create('section', 'opportunity-map-controls');
    controls.setAttribute('aria-labelledby', 'opportunity-functions-title');
    const controlsHeader = create('div', 'opportunity-map-controls-header');
    controlsHeader.append(
      create('span', 'interaction-panel-kicker', 'FONCTION MÉTIER'),
      create('h3', 'interaction-panel-title', 'CHOISIR UN TERRAIN')
    );
    controlsHeader.querySelector('h3').id = 'opportunity-functions-title';
    controls.append(controlsHeader, create('p', 'opportunity-map-intro', config.intro));

    const functionList = create('div', 'opportunity-function-list');
    const functionItems = functions.map((businessFunction, index) => {
      const button = create('button', 'opportunity-function-button');
      button.type = 'button';
      button.dataset.functionKey = businessFunction.key;
      button.setAttribute('aria-pressed', 'false');
      button.append(
        create('span', 'opportunity-function-number', String(index + 1).padStart(2, '0')),
        create('strong', '', businessFunction.label)
      );
      button.addEventListener('click', () => {
        state.selectedFunction = businessFunction.key;
        state.selectedOpportunity = null;
        render();
      });
      functionList.append(button);
      return { businessFunction, button };
    });
    controls.append(functionList);
    root.append(controls);

    const selectedPanel = create('section', 'opportunity-map-result');
    selectedPanel.setAttribute('aria-labelledby', 'opportunity-result-title');
    const resultHeader = create('div', 'opportunity-result-header');
    const resultKicker = create('span', 'interaction-panel-kicker', 'CARTE FILTRÉE · CLIQUER POUR OUVRIR');
    const resultTitle = create('h3', 'opportunity-result-title');
    resultTitle.id = 'opportunity-result-title';
    resultHeader.append(resultKicker, resultTitle);
    selectedPanel.append(resultHeader);

    const matrix = create('div', 'opportunity-matrix');
    matrix.setAttribute('role', 'grid');
    matrix.setAttribute('aria-label', 'Opportunités par niveau de transformation');
    selectedPanel.append(matrix);
    root.append(selectedPanel);

    const detailPanel = create('section', 'opportunity-detail-panel');
    detailPanel.setAttribute('aria-labelledby', 'opportunity-detail-title');
    detailPanel.hidden = true;
    const detailHeader = create('div', 'opportunity-detail-header');
    detailHeader.append(
      create('span', 'interaction-kicker', 'FICHE CAS D’USAGE'),
      create('button', 'opportunity-detail-close', 'FERMER')
    );
    const closeButton = detailHeader.querySelector('button');
    closeButton.type = 'button';
    closeButton.addEventListener('click', () => {
      state.selectedOpportunity = null;
      render();
    });
    const detailTitle = create('h3', 'opportunity-detail-title');
    detailTitle.id = 'opportunity-detail-title';
    const detailMode = create('span', 'opportunity-detail-mode');
    const detailBody = create('div', 'opportunity-detail-body');
    detailPanel.append(detailHeader, detailTitle, detailMode, detailBody);
    root.append(detailPanel);

    const liveStatus = create('p', 'interaction-live-status opportunity-map-live-status');
    liveStatus.setAttribute('role', 'status');
    liveStatus.setAttribute('aria-live', 'polite');
    root.append(liveStatus);

    function renderDetail(opportunity) {
      if (!opportunity) {
        detailPanel.hidden = true;
        detailBody.replaceChildren();
        return;
      }
      const solution = solutions.find((candidate) => candidate.key === opportunity.solutionCategory);
      detailPanel.hidden = false;
      detailTitle.textContent = opportunity.label;
      detailMode.textContent = `${opportunity.level.toUpperCase()} · ${opportunity.implementation}`;
      detailMode.dataset.mode = opportunity.implementation.toLowerCase();
      detailBody.replaceChildren(
        textField('BESOIN', opportunity.need, 'opportunity-detail-need'),
        listField('ENTRÉES', opportunity.inputs),
        listField('CAPACITÉS IA', opportunity.capabilities),
        textField('SOLUTION TYPE', opportunity.solutionType),
        listField('OUTILS POSSIBLES', opportunity.tools),
        textField('POURQUOI ?', opportunity.why),
        listField('CONDITIONS DE SUCCÈS', opportunity.successConditions),
        listField('SIGNAUX · VALEUR', opportunity.valueSignals),
        listField('SIGNAUX · FAISABILITÉ', opportunity.feasibilitySignals),
        listField('RISQUES', opportunity.risks)
      );
      if (solution) {
        const solutionField = create('div', 'opportunity-detail-solution');
        solutionField.append(
          create('small', '', `FAMILLE · ${solution.family}`),
          create('p', '', solution.description),
          create('span', 'opportunity-solution-examples', `Exemples : ${solution.examples.join(' · ')}`)
        );
        detailBody.append(solutionField);
      }
    }

    function render() {
      const selected = functions.find((businessFunction) => businessFunction.key === state.selectedFunction) || functions[0];
      if (!selected) return;
      const selectedOpportunity = Object.values(selected.opportunities || {})
        .flat()
        .find((opportunity) => opportunity.id === state.selectedOpportunity);
      resultTitle.textContent = `${selected.label} · ${levels.length} niveaux de possibilités`;
      matrix.replaceChildren();

      const header = create('div', 'opportunity-matrix-header');
      header.setAttribute('role', 'row');
      header.append(create('span', 'opportunity-row-label', 'NIVEAUX'));
      levels.forEach((level) => {
        const cell = create('span', 'opportunity-column-label', level.shortLabel || level.label);
        cell.setAttribute('role', 'columnheader');
        cell.title = level.description || '';
        header.append(cell);
      });
      matrix.append(header);

      const row = create('div', 'opportunity-matrix-row');
      row.setAttribute('role', 'row');
      const rowLabel = create('strong', 'opportunity-row-label', selected.label);
      rowLabel.setAttribute('role', 'rowheader');
      row.append(rowLabel);
      levels.forEach((level) => {
        const cell = create('div', 'opportunity-cell');
        cell.setAttribute('role', 'gridcell');
        cell.append(create('small', '', level.label));
        const list = create('div', 'opportunity-card-list');
        (selected.opportunities[level.key] || []).forEach((opportunity) => {
          const card = create('button', 'opportunity-card');
          card.type = 'button';
          card.dataset.opportunityId = opportunity.id;
          card.setAttribute('aria-expanded', String(opportunity.id === state.selectedOpportunity));
          card.append(
            create('strong', '', opportunity.label),
            create('span', '', opportunity.solutionType),
            create('em', '', opportunity.implementation)
          );
          card.addEventListener('click', () => {
            state.selectedOpportunity = opportunity.id;
            render();
            closeButton.focus({ preventScroll: true });
          });
          list.append(card);
        });
        cell.append(list);
        row.append(cell);
      });
      matrix.append(row);

      functionItems.forEach(({ businessFunction, button }) => {
        const active = businessFunction.key === selected.key;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      renderDetail(selectedOpportunity);
      root.dataset.function = selected.key;
      liveStatus.textContent = selectedOpportunity
        ? `Fiche ouverte : ${selectedOpportunity.label} · ${selectedOpportunity.implementation}.`
        : `${selected.label} sélectionné · ${levels.length} niveaux affichés · ouvrez une carte pour voir la solution.`;
    }

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.classList.remove('opportunity-map-interaction');
        root.removeAttribute('role');
        root.removeAttribute('aria-label');
        delete root.dataset.function;
      }
    };
  }

  registry['opportunity-map'] = { mount };
})();
