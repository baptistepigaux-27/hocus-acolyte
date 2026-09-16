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
    const cases = slide.interaction?.cases || [];
    const state = { selectedCase: slide.interaction?.defaultCase || cases[0]?.opportunityId };
    root.innerHTML = '';
    root.className = 'opportunity-scoring-interaction';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Comparaison d’opportunités sans score global');

    const heading = create('div', 'opportunity-scoring-heading');
    heading.append(create('span', 'interaction-kicker', 'SUPPORT DE DISCUSSION'), create('strong', '', 'Comparer sans fabriquer une fausse précision.'));
    root.append(heading);
    const caseList = create('div', 'opportunity-scoring-cases');
    const detail = create('section', 'opportunity-scoring-detail');
    const status = create('p', 'interaction-live-status opportunity-scoring-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.append(caseList, detail, status);

    cases.forEach((candidate, index) => {
      const button = create('button', 'opportunity-scoring-case');
      button.type = 'button';
      button.dataset.opportunityId = candidate.opportunityId;
      button.setAttribute('aria-pressed', 'false');
      button.append(create('span', '', String(index + 1).padStart(2, '0')), create('strong', '', candidate.label));
      button.addEventListener('click', () => {
        state.selectedCase = candidate.opportunityId;
        render();
      });
      caseList.append(button);
    });

    function render() {
      const candidate = cases.find((item) => item.opportunityId === state.selectedCase) || cases[0];
      if (!candidate) return;
      detail.replaceChildren(create('span', 'interaction-panel-kicker', 'INDICATEURS À VÉRIFIER'), create('h3', '', candidate.label));
      const indicators = create('div', 'opportunity-scoring-indicators');
      [['VALUE', candidate.value, 'value'], ['FEASIBILITY', candidate.feasibility, 'feasibility'], ['TIME TO IMPACT', candidate.time, 'time'], ['RISK', candidate.risk, 'risk']].forEach(([label, value, key]) => {
        const indicator = create('div', `scoring-indicator scoring-${key}`);
        indicator.append(create('small', '', label), create('strong', '', value));
        indicators.append(indicator);
      });
      const evidence = create('div', 'opportunity-scoring-evidence');
      evidence.append(create('small', '', 'À VÉRIFIER'));
      (candidate.evidence || []).forEach((item) => evidence.append(create('span', '', item)));
      detail.append(indicators, evidence, create('p', 'opportunity-scoring-note', candidate.note));
      caseList.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.opportunityId === candidate.opportunityId);
        button.setAttribute('aria-pressed', String(button.dataset.opportunityId === candidate.opportunityId));
      });
      status.textContent = `${candidate.label} sélectionné · indicateurs de discussion, sans score global.`;
    }

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.className = '';
      }
    };
  }

  registry['opportunity-scoring'] = { mount };
})();
