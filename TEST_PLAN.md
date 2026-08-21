# Test Plan

## Automated browser tests
Open `tests/test-runner.html` through the local server. Tests cover role restrictions, mode selection, session snapshot immutability, confirmations, timer pause/resume, lockout model, schema validation, rejected import immutability, v1→v2 migration, storage round-trip, and relative service-worker path construction.

## Manual acceptance checklist
- [ ] Current iPad Safari: complete first-run setup and create a four-digit PIN.
- [ ] Landscape: one mission fits without required page scrolling; controls are comfortably tappable.
- [ ] Portrait and phone: content remains usable.
- [ ] Audio activates only after a deliberate tap; mute state is visible.
- [ ] Speech plays mission text when available and leaves readable text when unavailable.
- [ ] Both child confirmations are required; accidental second taps do not advance the mission.
- [ ] Hold a completed child button for two seconds to undo confirmation.
- [ ] Need More Time has no penalty.
- [ ] Refresh during setup/home/mission/inspection and confirm the stored state resumes.
- [ ] Hide the page for over 30 seconds and confirm hidden time is not counted.
- [ ] Complete first online load, use Airplane Mode, then launch and continue an active mission offline.
- [ ] Add to Home Screen and verify standalone launch.
- [ ] Enable reduced motion and confirm wobble/celebration animation is suppressed.
- [ ] Navigate with keyboard; verify visible focus.
- [ ] Verify buttons and form controls expose meaningful screen-reader labels/text.
- [ ] Fail parent PIN five times and confirm 30-second lockout.
- [ ] Parent inspection can approve or return selected missions; prior child credit remains.
- [ ] Export a backup; import it; verify configuration/history match.
- [ ] Attempt an invalid import and confirm current data is unchanged.
- [ ] Full reset requires two confirmations and exact typed phrase `RESET ROOM MONSTER`.
- [ ] Update service-worker cache version outside an active session and verify update notice/reload behavior.
- [ ] Network panel shows no third-party requests.

## Bilingual acceptance checks

1. From the child home screen, tap **ES** and confirm the home story, controls, connectivity badge, mode selection, battle briefing, mission instructions, safety warning, completion buttons, celebration, inspection request, and victory screen change to Spanish.
2. Reload the browser and relaunch from the iPad Home Screen; confirm the selected language persists.
3. Switch back with **EN** and confirm English returns immediately without changing mission progress.
4. In Parent → Settings, change the interface language and confirm parent navigation, settings, history, backup tools, dialogs, and child mode use the selected language.
5. With speech enabled, tap the mission audio control in both languages and confirm Safari uses an appropriate English or Spanish voice when the device provides one; verify text remains available if speech synthesis has no matching voice.
6. Start a session in one language, switch languages mid-session, and confirm the same session, mission index, confirmations, roles, timer, collectibles, and inspection state remain intact.
7. Migrate an existing schema-v2 backup and confirm profiles/history remain intact and the language defaults to English until changed.
