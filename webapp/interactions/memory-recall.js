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
    const memories = config.memories || [];
    const state = { mode: 'without', selected: null };

    root.innerHTML = '';
    root.classList.add('memory-recall-interaction');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Simulation interactive : rappeler une mémoire de travail');

    const heading = create('div', 'interaction-mission');
    heading.append(
      create('span', 'interaction-kicker', 'MEMORY RECALL'),
      create('strong', 'interaction-mission-text', config.scenario)
    );
    root.append(heading);

    const modeBar = create('div', 'memory-mode-bar');
    const modeLabel = create('span', 'interaction-panel-kicker', 'ACTION');
    const withoutButton = create('button', 'memory-mode-button', 'SANS MÉMOIRE');
    withoutButton.type = 'button';
    const withButton = create('button', 'memory-mode-button', 'AVEC MÉMOIRE');
    withButton.type = 'button';
    modeBar.append(modeLabel, withoutButton, withButton);
    root.append(modeBar);

    const columns = create('div', 'memory-recall-columns');
    const library = create('section', 'interaction-panel memory-library');
    library.setAttribute('aria-labelledby', 'memory-library-title');
    const libraryHeader = create('div', 'interaction-panel-header');
    libraryHeader.append(
      create('span', 'interaction-panel-kicker', 'PROVENANCE'),
      create('h3', 'interaction-panel-title', 'MÉMOIRE DE TRAVAIL')
    );
    libraryHeader.querySelector('h3').id = 'memory-library-title';
    library.append(libraryHeader);
    library.append(create('p', 'memory-library-intro', 'Sélectionnez une note pour la réinjecter dans la session future.'));
    const memoryList = create('div', 'memory-note-list');
    const memoryItems = memories.map((memory) => {
      const button = create('button', 'memory-note');
      button.type = 'button';
      button.dataset.memoryKey = memory.key;
      button.setAttribute('aria-pressed', 'false');
      button.append(
        create('small', '', `${memory.date} · ${memory.kind}`),
        create('strong', '', memory.label),
        create('span', '', memory.summary)
      );
      button.addEventListener('click', () => {
        state.selected = state.selected === memory.key ? null : memory.key;
        render();
      });
      memoryList.append(button);
      return { memory, button };
    });
    library.append(memoryList);
    columns.append(library);

    const session = create('section', 'interaction-panel memory-session');
    session.setAttribute('aria-labelledby', 'memory-session-title');
    const sessionHeader = create('div', 'interaction-panel-header');
    sessionHeader.append(
      create('span', 'interaction-panel-kicker', 'OBSERVATION'),
      create('h3', 'interaction-panel-title', 'SESSION FUTURE')
    );
    sessionHeader.querySelector('h3').id = 'memory-session-title';
    session.append(sessionHeader);
    const sessionTitle = create('h4', 'memory-session-title');
    const sessionResponse = create('p', 'memory-session-response');
    session.append(sessionTitle, sessionResponse);
    const sessionItems = create('ul', 'memory-session-items');
    session.append(sessionItems);
    const recalledNote = create('div', 'recalled-note');
    recalledNote.hidden = true;
    recalledNote.append(
      create('small', '', 'NOTE RÉINJECTÉE'),
      create('strong', 'recalled-note-title'),
      create('p', 'recalled-note-detail'),
      create('span', 'recalled-note-source')
    );
    session.append(recalledNote);
    const sessionProof = create('div', 'memory-session-proof');
    sessionProof.append(create('small', '', 'PREUVE'), create('span'));
    session.append(sessionProof);
    columns.append(session);
    root.append(columns);

    const liveStatus = create('p', 'interaction-live-status memory-live-status');
    liveStatus.setAttribute('role', 'status');
    liveStatus.setAttribute('aria-live', 'polite');
    root.append(liveStatus);

    function render() {
      const hasMemory = state.mode === 'with';
      const selectedMemory = memories.find((memory) => memory.key === state.selected);
      root.dataset.mode = state.mode;
      withoutButton.setAttribute('aria-pressed', String(!hasMemory));
      withButton.setAttribute('aria-pressed', String(hasMemory));
      withoutButton.classList.toggle('is-active', !hasMemory);
      withButton.classList.toggle('is-active', hasMemory);
      library.hidden = !hasMemory;
      sessionTitle.textContent = hasMemory ? 'Contexte retrouvé' : config.without.title;
      sessionResponse.textContent = hasMemory
        ? selectedMemory ? selectedMemory.detail : config.with.response
        : config.without.response;
      sessionItems.replaceChildren();
      const items = hasMemory ? config.with.recovered : config.without.missing;
      items.forEach((item) => {
        const li = create('li');
        li.append(create('span', 'memory-item-tag', item.tag), create('strong', '', item.text));
        sessionItems.append(li);
      });
      recalledNote.hidden = !selectedMemory;
      if (selectedMemory) {
        recalledNote.querySelector('.recalled-note-title').textContent = selectedMemory.label;
        recalledNote.querySelector('.recalled-note-detail').textContent = selectedMemory.detail;
        recalledNote.querySelector('.recalled-note-source').textContent = `${selectedMemory.date} · source : ${selectedMemory.source}`;
      }
      sessionProof.querySelector('span').textContent = hasMemory
        ? selectedMemory ? 'note datée + source conservée' : 'mémoire disponible, note à sélectionner'
        : 'nouvelle session · rien de retrouvé';
      liveStatus.textContent = !hasMemory
        ? 'Sans mémoire : il faut tout réexpliquer avant de reprendre.'
        : selectedMemory
          ? `Note réinjectée : ${selectedMemory.label}. La continuité devient exploitable.`
          : 'Avec mémoire : sélectionnez une décision pour la réinjecter.';
      memoryItems.forEach(({ memory, button }) => {
        const isSelected = hasMemory && selectedMemory && selectedMemory.key === memory.key;
        button.setAttribute('aria-pressed', String(Boolean(isSelected)));
        button.classList.toggle('is-selected', Boolean(isSelected));
      });
    }

    withoutButton.addEventListener('click', () => {
      state.mode = 'without';
      state.selected = null;
      render();
    });
    withButton.addEventListener('click', () => {
      state.mode = 'with';
      render();
    });

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.classList.remove('memory-recall-interaction');
        root.removeAttribute('role');
        root.removeAttribute('aria-label');
        delete root.dataset.mode;
      }
    };
  }

  registry['memory-recall'] = { mount };
})();
