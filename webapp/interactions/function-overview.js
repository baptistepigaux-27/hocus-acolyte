(() => {
  'use strict';

  const registry = window.ACOLYTE_INTERACTIONS || (window.ACOLYTE_INTERACTIONS = {});

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function opportunityCard(label, opportunity, tone) {
    const card = create('article', `function-example-card function-example-${tone}`);
    card.append(create('small', '', label));
    card.append(create('strong', '', opportunity?.label || 'À préciser'));
    card.append(create('span', '', opportunity?.implementation || 'À qualifier'));
    return card;
  }

  function mount(root, slide) {
    const functions = slide.interaction?.functions || [];
    const state = { selectedFunction: functions[0]?.key };
    root.innerHTML = '';
    root.className = 'function-overview-interaction';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Exemples d’opportunités par fonction');

    const heading = create('div', 'function-overview-heading');
    heading.append(create('span', 'interaction-kicker', 'VUE SYNTHÉTIQUE'), create('strong', '', 'Un terrain, trois horizons de décision.'));
    root.append(heading);
    const tabs = create('div', 'function-overview-tabs');
    const cards = create('div', 'function-overview-cards');
    root.append(tabs, cards);
    const link = create('a', 'function-overview-map-link', 'OUVRIR DANS L’OPPORTUNITY MAP →');
    link.href = '?journey=pme&slide=3';
    root.append(link);
    const status = create('p', 'interaction-live-status function-overview-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.append(status);

    functions.forEach((businessFunction, index) => {
      const button = create('button', 'function-overview-tab', businessFunction.label);
      button.type = 'button';
      button.dataset.functionKey = businessFunction.key;
      button.setAttribute('aria-pressed', 'false');
      button.prepend(create('span', '', String(index + 1).padStart(2, '0')));
      button.addEventListener('click', () => {
        state.selectedFunction = businessFunction.key;
        render();
      });
      tabs.append(button);
    });

    function render() {
      const selected = functions.find((businessFunction) => businessFunction.key === state.selectedFunction) || functions[0];
      if (!selected) return;
      cards.replaceChildren(
        opportunityCard('QUICK WIN', selected.quickWin, 'quick'),
        opportunityCard('PROCESS WIN', selected.processWin, 'process'),
        opportunityCard('STRATEGIC BET', selected.strategicBet, 'strategic')
      );
      link.href = `?journey=pme&slide=3&function=${encodeURIComponent(selected.key)}`;
      tabs.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.functionKey === selected.key);
        button.setAttribute('aria-pressed', String(button.dataset.functionKey === selected.key));
      });
      status.textContent = `${selected.label} · quick win, process win et pari stratégique affichés.`;
    }

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.className = '';
      }
    };
  }

  registry['function-overview'] = { mount };
})();
