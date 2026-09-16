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
    const roles = config.roles || [];
    const solutions = config.solutions || [];
    const state = { selectedRole: config.defaultRole || roles[0]?.key };

    root.innerHTML = '';
    root.className = 'role-selector-interaction';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Sélecteur de métier augmenté');

    const heading = create('div', 'role-selector-heading');
    heading.append(create('span', 'interaction-kicker', 'INDIVIDU AUGMENTÉ'), create('strong', '', 'Quel geste de travail voulez-vous améliorer ?'));
    root.append(heading);

    const roleList = create('div', 'role-selector-tabs');
    const roleButtons = roles.map((role, index) => {
      const button = create('button', 'role-selector-tab');
      button.type = 'button';
      button.textContent = role.label;
      button.dataset.roleKey = role.key;
      button.setAttribute('aria-pressed', 'false');
      button.prepend(create('span', '', String(index + 1).padStart(2, '0')));
      button.addEventListener('click', () => {
        state.selectedRole = role.key;
        render();
      });
      roleList.append(button);
      return { role, button };
    });
    root.append(roleList);

    const stage = create('div', 'role-selector-stage');
    root.append(stage);
    const status = create('p', 'interaction-live-status role-selector-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.append(status);

    function render() {
      const role = roles.find((candidate) => candidate.key === state.selectedRole) || roles[0];
      if (!role) return;
      const solution = solutions.find((candidate) => candidate.key === role.solutionCategory);
      stage.replaceChildren();
      const taskPanel = create('section', 'role-task-panel');
      taskPanel.append(create('span', 'interaction-panel-kicker', `TÂCHES · ${role.label.toUpperCase()}`));
      const taskList = create('div', 'role-task-list');
      role.tasks.forEach((task, index) => {
        const card = create('div', 'role-task-card');
        card.append(create('span', '', String(index + 1).padStart(2, '0')), create('strong', '', task));
        taskList.append(card);
      });
      taskPanel.append(taskList);
      const summary = create('section', 'role-selector-summary');
      summary.append(create('span', 'interaction-panel-kicker', 'SOLUTION TYPE'));
      const summaryGrid = create('div', 'role-selector-summary-grid');
      [
        ['COPILOTE', 'Aide à comprendre, rédiger et préparer'],
        [`APPROCHE FRÉQUENTE · ${role.approach}`, 'Acheter une solution existante'],
        [`TIME TO IMPACT · ${role.timeToImpact}`, 'Une première preuve en jours']
      ].forEach(([label, detail]) => {
        const item = create('div', 'role-summary-item');
        item.append(create('small', '', label), create('strong', '', detail));
        summaryGrid.append(item);
      });
      if (solution) {
        const examples = create('p', 'role-selector-examples');
        examples.append(create('small', '', 'EXEMPLES · '), document.createTextNode(solution.examples.join(' · ')));
        summary.append(summaryGrid, examples);
      } else {
        summary.append(summaryGrid);
      }
      stage.append(taskPanel, summary);
      roleButtons.forEach(({ role: candidate, button }) => {
        const active = candidate.key === role.key;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      status.textContent = `${role.label} sélectionné · ${role.tasks.length} gestes de travail · approche fréquente ${role.approach}.`;
    }

    render();
    return {
      destroy: () => {
        root.replaceChildren();
        root.className = '';
      }
    };
  }

  registry['role-selector'] = { mount };
})();
