import { el, button } from '../ui.js';
import { t, setLanguage, localized, modeName, getLanguage } from '../i18n.js';

export function renderParentDashboard(root, data, actions, section = 'dashboard') {
  const nav = ['dashboard', 'profiles', 'missions', 'modes', 'rewards', 'settings', 'history', 'data'];
  const sectionLabel = t(`nav_${section}`);
  const shell = el(
    'div',
    { class: 'parent-shell' },
    el(
      'nav',
      { class: 'parent-nav' },
      ...nav.map(item => button(t(`nav_${item}`), 'btn-secondary', () => actions.goParent(item)))
    ),
    el('section', { class: 'card parent-content' })
  );
  const content = shell.lastChild;
  content.append(el('h1', { text: t('parentSection', { section: sectionLabel }) }));

  if (section === 'dashboard') {
    content.append(
      el('p', {
        text: t('summary', {
          heroes: data.children.filter(child => child.active !== false).length,
          missions: data.missions.filter(mission => mission.active && !mission.archived).length,
          sessions: data.sessionHistory.length
        })
      }),
      el('p', { class: 'notice', text: t('autoClose') }),
      button(t('returnChild'), 'btn-primary', () => actions.exitParent())
    );
  } else if (section === 'profiles') {
    for (const child of data.children) {
      const name = el('input', { value: child.displayName });
      name.value = child.displayName;
      const active = el('input', { type: 'checkbox' });
      active.checked = child.active !== false;
      content.append(
        el(
          'div',
          { class: 'list-item editor-row' },
          el('div', {}, name, el('label', {}, active, ` ${t('active')}`)),
          button(t('save'), 'btn-primary', async () => {
            child.displayName = name.value.trim().slice(0, 24) || child.displayName;
            child.active = active.checked;
            await actions.save(data);
            actions.notice(t('profileSaved'));
          })
        )
      );
    }
    if (data.children.length < 4) {
      content.append(
        button(t('addHero'), 'btn-secondary', async () => {
          data.children.push({
            id: crypto.randomUUID(),
            displayName: t('newHero'),
            avatar: '🦸',
            heroTitle: t('roomRanger'),
            active: true,
            roleRestrictions: [],
            order: data.children.length
          });
          await actions.save(data);
          actions.goParent('profiles');
        })
      );
    }
  } else if (section === 'missions') {
    for (const mission of data.missions) {
      const active = el('input', { type: 'checkbox' });
      active.checked = mission.active && !mission.archived;
      content.append(
        el(
          'div',
          { class: 'list-item editor-row' },
          el(
            'div',
            {},
            el('strong', { text: `${mission.icon} ${localized(mission, 'title')}` }),
            el('div', { text: localized(mission, 'childInstruction') })
          ),
          el(
            'div',
            {},
            active,
            button(t('duplicate'), 'btn-secondary', async () => {
              const copy = structuredClone(mission);
              copy.id = crypto.randomUUID();
              copy.title += getLanguage() === 'en' ? t('copySuffix') : ' Copy';
              copy.titleEs = (copy.titleEs || copy.title) + (getLanguage() === 'es' ? t('copySuffix') : ' Copia');
              data.missions.push(copy);
              await actions.save(data);
              actions.goParent('missions');
            }),
            button(t('save'), 'btn-primary', async () => {
              mission.active = active.checked;
              await actions.save(data);
              actions.notice(t('missionUpdated'));
            })
          )
        )
      );
    }
    content.append(button(t('restoreFactory'), 'btn-gold', () => actions.restoreMissions()));
  } else if (section === 'modes') {
    for (const mode of data.gameModes) {
      const selectable = el('input', { type: 'checkbox' });
      selectable.checked = mode.childSelectable;
      selectable.onchange = async () => {
        mode.childSelectable = selectable.checked;
        await actions.save(data);
      };
      content.append(el('label', { class: 'list-item' }, selectable, ' ', modeName(mode)));
    }
  } else if (section === 'rewards') {
    const reward = el('textarea', { rows: '3' });
    reward.value = getLanguage() === 'es'
      ? data.appSettings.rewardMessageEs || data.appSettings.rewardMessage
      : data.appSettings.rewardMessage;
    content.append(
      el('label', { class: 'field' }, el('span', { text: t('familyReward') }), reward),
      button(t('saveReward'), 'btn-primary', async () => {
        if (getLanguage() === 'es') {
          data.appSettings.rewardMessageEs = reward.value.slice(0, 240);
        } else {
          data.appSettings.rewardMessage = reward.value.slice(0, 240);
        }
        await actions.save(data);
        actions.notice(t('rewardSaved'));
      })
    );
  } else if (section === 'settings') {
    const speech = el('input', { type: 'checkbox' });
    speech.checked = data.appSettings.speech;
    const inspect = el('input', { type: 'checkbox' });
    inspect.checked = data.appSettings.inspectionRequired;
    const motion = el('input', { type: 'checkbox' });
    motion.checked = data.appSettings.reducedMotion;
    const language = el(
      'select',
      {},
      el('option', { value: 'en', text: 'English' }),
      el('option', { value: 'es', text: 'Español' })
    );
    language.value = data.appSettings.language || 'en';

    content.append(
      el('label', { class: 'list-item' }, speech, ` ${t('spokenSetting')}`),
      el('label', { class: 'list-item' }, inspect, ` ${t('inspectSetting')}`),
      el('label', { class: 'list-item' }, motion, ` ${t('reduceMotion')}`),
      el('label', { class: 'field' }, el('span', { text: t('interfaceLanguage') }), language),
      button(t('saveSettings'), 'btn-primary', async () => {
        data.appSettings.speech = speech.checked;
        data.appSettings.inspectionRequired = inspect.checked;
        data.appSettings.reducedMotion = motion.checked;
        data.appSettings.language = language.value;
        setLanguage(language.value);
        await actions.save(data);
        actions.applyAccessibility();
        actions.refreshChrome();
        actions.notice(t('settingsSaved'));
        actions.goParent('settings');
      })
    );
  } else if (section === 'history') {
    if (!data.sessionHistory.length) {
      content.append(el('p', { text: t('noBattles') }));
    }
    for (const session of data.sessionHistory.slice(-100).reverse()) {
      content.append(
        el(
          'div',
          { class: 'list-item' },
          el('strong', {
            text: new Date(session.completedAt || session.startedAt).toLocaleString(
              getLanguage() === 'es' ? 'es-US' : 'en-US'
            )
          }),
          el('div', {
            text: `${modeName(session.modeSnapshot)} • ${session.missionSnapshots?.length || 0} ${t('missionsWord')} • ${session.inspection?.approved ? t('inspected') : t('completed')}`
          })
        )
      );
    }
  } else if (section === 'data') {
    const file = el('input', { type: 'file', accept: 'application/json,.json' });
    content.append(
      button(t('exportBackup'), 'btn-primary', () => actions.exportBackup()),
      el('label', { class: 'field' }, el('span', { text: t('importBackup') }), file),
      button(t('validateImport'), 'btn-gold', () => actions.importBackup(file.files?.[0])),
      el('hr'),
      el('p', { class: 'warning', text: t('resetWarning') }),
      button(t('fullReset'), 'btn-danger', () => actions.fullReset())
    );
  }

  root.replaceChildren(shell);
}
