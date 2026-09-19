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
    const cards = config.cards || [];
    const opportunities = config.opportunities || [];
    const state = { selectedCard: cards[0]?.key };
    const functionLabels = Object.fromEntries((config.functions || []).map((businessFunction) => [businessFunction.key, businessFunction.label]));
    const levelLabels = Object.fromEntries((config.levels || []).map((level) => [level.key, level.shortLabel || level.label]));

    root.innerHTML = '';
    root.className = 'portfolio-explorer-interaction';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Portfolio interactif des opportunités');
    const heading = create('div', 'portfolio-heading');
    heading.append(create('span', 'interaction-kicker', 'PORTEFEUILLE'), create('strong', '', 'Quelle attention donner à chaque idée ?'));
    root.append(heading);
    const grid = create('div', 'portfolio-grid');
    root.append(grid);
    const detail = create('section', 'portfolio-detail');
    root.append(detail);
    const status = create('p', 'interaction-live-status portfolio-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.append(status);

    cards.forEach((card) => {
      const button = create('button', `portfolio-card portfolio-${card.key}`);
      button.type = 'button';
      button.dataset.portfolioKey = card.key;
      button.setAttribute('aria-pressed', 'false');
      button.append(create('small', '', card.label), create('strong', '', card.description));
      button.addEventListener('click', () => {
        state.selectedCard = card.key;
        render();
      });
      grid.append(button);
    });

    function render() {
      const card = cards.find((candidate) => candidate.key === state.selectedCard) || cards[0];
      const opportunity = opportunities.find((candidate) => candidate.id === card?.opportunityId);
      if (!card || !opportunity) return;
      detail.replaceChildren(create('span', 'interaction-panel-kicker', 'FICHE PORTEFEUILLE'), create('h3', '', opportunity.label));
      const metadata = create('div', 'portfolio-metadata');
      metadata.append(create('span', '', `MÉTIER · ${functionLabels[opportunity.function] || opportunity.function}`), create('span', '', `NIVEAU · ${levelLabels[opportunity.level] || opportunity.level}`), create('b', '', `APPROCHE · ${opportunity.implementation}`));
      detail.append(metadata);
      const mapLink = create('a', 'portfolio-map-link', 'APPROFONDIR DANS LA MAP →');
      mapLink.href = `?journey=pme&slide=3&function=${encodeURIComponent(opportunity.function)}&opportunity=${encodeURIComponent(opportunity.id)}`;
      detail.append(mapLink);
      grid.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.portfolioKey === card.key);
        button.setAttribute('aria-pressed', String(button.dataset.portfolioKey === card.key));
      });
      status.textContent = `${card.label} · ${opportunity.label} · ${opportunity.implementation}.`;
    }

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.className = '';
      }
    };
  }

  registry['portfolio-explorer'] = { mount };
})();
