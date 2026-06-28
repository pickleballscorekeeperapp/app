# CODEX HAND-OFF: Pickleball Score Keeper v1.0
**Date:** 2026-06-11 · **Project root:** `/Users/user/Documents/Claude/Projects/pickleball-score-keeper` (standalone — already moved OUT of the CourtsideView folder; do NOT commit into the CourtsideView repo) · **Origin:** ported from CourtsideView's scorekeeper architecture and v11 design canon.

A standalone iOS + Android app. One job: keep the official USA Pickleball score so players never wonder what the call is. Target user: older rec players (YMCA crowd) — big type, big tap targets, high contrast. Code-complete and **smoke-tested live in Expo Go on an iPhone 17 Pro simulator (2026-06-11)**; your job is finalize → repo → build → ship.

---

## Repo orientation (verified paths)

- **Stack:** Expo SDK 52 / RN 0.76.9, React Navigation 7 (native-stack), Zustand 5 + AsyncStorage (NOT MMKV — intentional, so the app runs in Expo Go with zero native config). Light-only theme. `newArchEnabled: false` in app.json, but note Expo Go always runs New Arch — the app works under it (verified).
- **Entry:** `index.ts` → `App.tsx` (4-screen stack: Home, Setup [modal], Game, History).
- **Domain logic (pure, tested):** `src/domain/scoring.ts` — event-sourced USA Pickleball doubles side-out engine. 12 passing tests in `src/domain/__tests__/scoring.test.ts` (`npm test`). **Do not modify the engine without running the tests.**
- **Stores:** `src/store/gameStore.ts` (live event log, persisted — survives force-quit mid-game), `src/store/historyStore.ts` (completed games). Both use `createJSONStorage(() => AsyncStorage)` — keep this exact pattern (raw storage objects crash Zustand v5 persist; see CourtsideView v1.2.11 crash fix).
- **Theme:** `src/theme/` — ported from CourtsideView v11 (cream bg #F7F8FB, green #20A66B) + pickleball accents (`ball`, `courtBlue`, `teamA` blue / `teamB` green).
- **UI:** `src/screens/` + `src/components/TeamPanel.tsx`. Core interaction: tap the side that won the rally; the engine decides point / second server / side-out. The score-call banner ("0 – 1 – 1") is the hero element.
- **IDs:** iOS + Android `com.houseofturnberry.pickleballscorekeeper`.
- **Assets:** `assets/icon.png`, `adaptive-icon.png`, `splash-icon.png` — generated placeholder pickleball marks, fine for TestFlight, replace before store launch.

## Rules implemented (USA Pickleball Rulebook §4) — verified on-device, don't relitigate

- Only the serving team scores (4.A).
- First service sequence: starting team gets ONE server, designated #2, game opens "0-0-2" (4.B.6). One lost rally = immediate side-out. **Verified live in sim.**
- Thereafter both partners serve before side-out (4.B.7); side-out passes serve to opponents' server #1 (4.E).
- Three-number call: serving – receiving – server # (4.D), rendered by `scoreCall()`.
- Even score → serve from right/even court (4.B.4), via `servesFromRight()`.
- Games to 11/15/21, win by 2. Tournament end-switch hint at 6/8/11 (one-time dismissible banner).
- Undo = replay event log minus one (deterministic, tested).

## Already done (2026-06-11 session) — do not redo

1. Moved out of CourtsideView; fresh `npm install` at the new path.
2. `expo-asset` explicitly installed via `npx expo install expo-asset` (was missing transitively; now pinned in package.json).
3. Live smoke test in Expo Go (iPhone 17 Pro sim): setup flow, rally taps, 0-0-2 opening call, first-server-exception side-out, serve badge, undo enable state — all correct.
4. Kate-requested UI polish (older demographic): removed "House of Turnberry" eyebrow on Home; removed 🏓 from serve pill; pill split into "SERVING #N" + "RIGHT/LEFT COURT" line (no wrap/truncation); UNDO/END GAME now white with 2px dark borders, larger text; call caption capitalized + enlarged; tap hint shortened to one centered line ("TAP IF WE WON").

## Your tasks (in order)

1. **Full typecheck.** `npm run typecheck` — the pure engine is verified; the RN/TSX layer compiled and ran clean in Metro but has not been run through `tsc` against node_modules. Fix any nits. Run `npm test` (should stay 12/12).
2. **Full-game smoke test.** Play to 11 incl. deuce (11-10 must NOT end; 12-10 ends), Save & Done → History, force-quit mid-game → Resume card. Test Android emulator too.
3. **GitHub repo.** Use the standalone remote `https://github.com/pickleballscorekeeperapp/app.git`; do not push this code into the CourtsideView repo.
4. **EAS setup.** Use the existing separate project `@abridegan/pickleball-score-keeper` (`6f29222e-67f0-411b-851b-32e23775487e`). It may share the `abridegan` owner with CourtsideView, but it must never reuse CourtsideView's project ID, bundle ID, App Store record, or git remote. Apple: same Developer account, new bundle ID + App Store Connect app.
5. **Store metadata.** Name "Pickleball Score Keeper", subtitle "Official side-out scoring", category Sports. No tracking, no network calls, no permissions — privacy "Data Not Collected".

## Cross-cutting rules

- Keep it dependency-light and fully offline. No analytics, no Supabase, no accounts in v1.
- All scoring logic stays in `src/domain/scoring.ts` as pure functions with tests. UI never computes score.
- Older-demographic design bar: touch targets ≥ 48pt, the two TeamPanels stay dominant, no low-contrast gray-on-white controls, no text wrapping in badges/pills.
- If Kate runs commands herself: she is not a developer — single-purpose copy-paste blocks, label whole-block vs line-by-line, never mix commands and comments.
- ⚠️ If OTA updates are added later: `eas update` requires Node v22.22.2 via nvm (House of Turnberry environment constraint — silent fingerprint rejection otherwise).

## Acceptance

- `npm run typecheck` + `npm test` clean.
- Call sequence hand-verified: 0-0-2 → (serving wins) 1-0-2 → (serving loses) side-out 0-1-1 → 0-1-2 → side-out 1-0-1.
- 11-10 does not end the game; 12-10 does. Post-game-over taps are no-ops.
- Mid-game force-quit recovery on both platforms.
- TestFlight + internal-track Android builds install and score a full game.

## v1.1 candidates (do NOT build now)
Singles mode · rally-scoring toggle (MLP style) · best-of-3 match wrapper · text-to-speech score calls · live share page (reuse CourtsideView FanView architecture: dual-write + 2s polling, `cleanUrls:false` + regex rewrites on Vercel).
