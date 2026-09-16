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
    const levels = config.levels || [];
    const functions = config.functions || [];
    const state = { selectedFunction: config.defaultFunction || functions[0]?.key };

    root.innerHTML = '';
    root.classList.add('opportunity-map-interaction');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Opportunity Map interactive : explorer les métiers');

    const heading = create('div', 'interaction-mission');
    heading.append(
      create('span', 'interaction-kicker', 'OPPORTUNITY MAP'),
      create('strong', 'interaction-mission-text', 'Où l’IA peut-elle améliorer un travail important ?')
    );
    root.append(heading);

    const controls = create('section', 'opportunity-map-controls');
    controls.setAttribute('aria-labelledby', 'opportunity-functions-title');
    const controlsHeader = create('div', 'interaction-panel-header');
    controlsHeader.append(
      create('span', 'interaction-panel-kicker', 'FONCTION MÉTIER'),
      create('h3', 'interaction-panel-title', 'CHOISIR UN TERRAIN')
    );
    controlsHeader.querySelector('h3').id = 'opportunity-functions-title';
    controls.append(controlsHeader, create('p', 'opportunity-map-intro', config.intro));

    const functionList = create('div', 'opportunity-function-list');
    const functionItems = functions.map((businessFunction) => {
      const button = create('button', 'opportunity-function-button');
      button.type = 'button';
      button.dataset.functionKey = businessFunction.key;
      button.setAttribute('aria-pressed', 'false');
      button.append(
        create('span', 'opportunity-function-number', String(functions.indexOf(businessFunction) + 1).padStart(2, '0')),
        create('strong', '', businessFunction.label)
      );
      button.addEventListener('click', () => {
        state.selectedFunction = businessFunction.key;
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
    const resultKicker = create('span', 'interaction-panel-kicker', 'CARTE FILTRÉE');
    const resultTitle = create('h3', 'opportunity-result-title');
    resultTitle.id = 'opportunity-result-title';
    resultHeader.append(resultKicker, resultTitle);
    selectedPanel.append(resultHeader);

    const matrix = create('div', 'opportunity-matrix');
    matrix.setAttribute('role', 'grid');
    matrix.setAttribute('aria-label', 'Opportunités par niveau de transformation');
    selectedPanel.append(matrix);
    root.append(selectedPanel);

    const liveStatus = create('p', 'interaction-live-status opportunity-map-live-status');
    liveStatus.setAttribute('role', 'status');
    liveStatus.setAttribute('aria-live', 'polite');
    root.append(liveStatus);

    function render() {
      const selected = functions.find((businessFunction) => businessFunction.key === state.selectedFunction) || functions[0];
      if (!selected) return;
      resultTitle.textContent = `${selected.label} · 5 niveaux de possibilités`;
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
        const cell = create('article', 'opportunity-cell');
        cell.setAttribute('role', 'gridcell');
        cell.append(create('small', '', level.label));
        const list = create('ul');
        (selected.opportunities[level.key] || []).forEach((opportunity) => {
          list.append(create('li', '', opportunity));
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
      root.dataset.function = selected.key;
      liveStatus.textContent = `${selected.label} sélectionné · ${levels.length} niveaux affichés · les exemples restent à confronter au terrain.`;
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
