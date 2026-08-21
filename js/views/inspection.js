import { el, button } from '../ui.js';
import { t, localized } from '../i18n.js';

export function renderInspectionRequest(root, data, actions) {
  root.replaceChildren(
    el(
      'section',
      { class: 'child-screen' },
      el(
        'div',
        { class: 'card', style: 'text-align:center' },
        el('div', { class: 'monster', text: '😴' }),
        el('h1', { text: t('greatTeamwork') }),
        el('p', { text: t('inspectionAsk') }),
        button(t('grownInspection'), 'btn-gold', () => actions.requireParent('inspection'))
      )
    )
  );
}

export function renderInspection(root, data, actions) {
  const session = data.activeSession;
  const form = el(
    'div',
    { class: 'list' },
    ...session.missionSnapshots.map(mission => {
      const checkbox = el('input', { type: 'checkbox', value: mission.id });
      return el(
        'label',
        { class: 'list-item' },
        checkbox,
        ' ',
        t('returnLook', { mission: localized(mission, 'title') })
      );
    })
  );
  const note = el('textarea', { rows: '3', placeholder: t('optionalNote') });

  root.replaceChildren(
    el(
      'section',
      { class: 'card' },
      el('h1', { text: t('parentInspection') }),
      el('p', { text: t('inspectionHelp') }),
      form,
      el('label', { class: 'field' }, el('span', { text: t('note') }), note),
      el(
        'div',
        { class: 'button-row' },
        button(t('approveRoom'), 'btn-primary', () => actions.approveInspection(note.value)),
        button(t('returnSelected'), 'btn-gold', () => {
          const ids = [...form.querySelectorAll('input:checked')].map(input => input.value);
          if (!ids.length) {
            actions.notice(t('selectMission'));
            return;
          }
          actions.returnMissions(ids, note.value);
        })
      )
    )
  );
}
