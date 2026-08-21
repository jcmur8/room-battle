# Implementation Notes

## Architecture
Static ES-module PWA. IndexedDB stores one versioned root record. Business logic is separated into storage, migration, validation, security, audio/speech, timers, roles, game-engine, backup and view modules. All application URLs are relative for GitHub Pages project-subdirectory hosting.

## Requirement mapping
The application implements first-run setup; 1–4-profile data model (setup requires two); PBKDF2 PIN verification and lockout; eight editable factory missions; three game modes; role rotation/restrictions logic; independent child confirmations; immediate IndexedDB persistence; session snapshots; pause/resume; monster health/progress/collectibles; parent inspection/correction; history; backup/import validation; migration; offline cache; connectivity badge; speech; sound; reduced motion; Home Screen metadata; and parent reset protection.

## Deliberate simplifications / limitations
- The supplied release provides mission activation and duplication in the parent UI, but the compact editor does not expose every FR-031 mission field in a dedicated form. The underlying data model contains every required field.
- Reordering controls and drag-and-drop are not exposed in this first UI although order-preserving arrays are used.
- Parent role locks/restrictions are honored by logic but the dedicated role/rotation editing UI is not fully surfaced.
- Break reminders are represented by Pause/More Time behavior; an automatic break screen after N missions is not surfaced in this release.
- Parent inactivity timeout is enforced by the in-memory parent authorization window when navigating; no visible countdown is shown.
- Vibration preference is stored but vibration is not invoked because iPad Safari support is inconsistent.
- Local WAV files are included as original assets; runtime effects use Web Audio tones to remain robust on Safari.
- `_headers` is useful on Netlify/Cloudflare-compatible setups; GitHub Pages ignores it.

## Security/privacy
No real names, photos or PIN are included in source. The PIN verifier uses random salt + PBKDF2-SHA-256. User-entered text is assigned via `textContent`/text nodes and never dynamically inserted as HTML. Imported backups are parsed as JSON, migrated and validated before mutation; a pre-import backup downloads before confirmed replacement.

## Schema
Current schema version: 2. Migration from version 1 adds reward defaults and fills application settings.

## Version 1.1 — English / Spanish localization

- Added a persisted `appSettings.language` preference with supported values `en` and `es`.
- Added an always-available EN/ES header toggle plus language selection during first-run setup and Parent → Settings.
- Added `js/i18n.js` for interface strings, interpolation, role names, game-mode names, and localized record fields.
- Added authored Spanish translations for all eight factory mission titles, child instructions, parent instructions, and safety notes.
- Added Spanish names for factory modes and room zones and Spanish defaults for the family reward message.
- Browser speech synthesis now requests `en-US` or `es-US` based on the selected language and prefers a matching installed system voice when available.
- Schema version advanced from 2 to 3. Migration preserves existing profiles, history, settings, custom missions, and active sessions while adding bilingual factory fields and defaulting existing users to English.
- Custom mission or reward text that has no Spanish-specific value falls back to the saved original text; it is never machine-translated or sent to an external service.
- Service-worker cache advanced to `room-monster-v1.1.0` and now precaches `js/i18n.js`.
