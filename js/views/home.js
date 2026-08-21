import { el, button } from '../ui.js';
import { t } from '../i18n.js';

export function renderHome(root, data, actions) {
  const active = data.activeSession && data.activeSession.status !== 'complete';
  const heroes = el(
    'div',
    { class: 'grid two' },
    ...data.children
      .filter(child => child.active !== false)
      .map(child =>
        el(
          'div',
          { class: 'hero-chip' },
          el('span', { class: 'hero-avatar', text: child.avatar }),
          el(
            'div',
            {},
            el('strong', { text: child.displayName }),
            el('div', { text: child.heroTitle || t('hero') })
          )
        )
      )
  );

  const destination = active
    ? data.activeSession.status === 'inspection'
      ? 'inspection-request'
      : data.activeSession.status === 'victory'
        ? 'victory'
        : 'mission'
    : data.appSettings.showModeSelection
      ? 'modes'
      : 'intro';

  const startData = active
    ? {}
    : { modeId: data.gameModes.find(mode => mode.defaultMode)?.id || 'normal' };

  root.replaceChildren(
    el(
      'section',
      { class: 'child-screen' },
      el(
        'div',
        { class: 'card hero-card' },
        el(
          'div',
          {},
          el('div', { class: 'monster messy', text: active ? '😮' : '👾' }),
          el('p', {
            style: 'text-align:center',
            text: active ? t('monsterActive') : t('monsterIdle')
          })
        ),
        el(
          'div',
          {},
          el('h1', { text: active ? t('battleProgress') : t('heroesNeed') }),
          heroes,
          el('p', { text: active ? t('progressSafe') : t('homeStory') }),
          button(active ? t('resume') : t('start'), 'btn-primary', async () => {
            await actions.audio();
            actions.go(destination, startData);
          })
        )
      )
    )
  );
}
