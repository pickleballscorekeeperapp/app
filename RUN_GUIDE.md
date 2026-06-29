# Pickleball Score Keeper — Run Guide (for Kate)

## What this is
A brand-new, standalone app — same scorekeeper DNA as CourtsideView, but for pickleball with official USA Pickleball side-out scoring. It lives in its own local repo and points at its own GitHub remote.

## How the app works (30 seconds)
1. **New Game** → name the teams, pick game-to (11 is official), pick who serves first.
2. On the game screen, **tap the side that won the rally**. That's it — the app figures out whether it's a point, the second server, or a side-out.
3. The big number banner at the top is **the official call** to say out loud (e.g. "4 – 2 – 1").
4. **Undo** fixes any mis-tap. The phone won't sleep during a game, and if the app gets killed mid-game, the score is still there when you reopen.

## Try it on your Mac (after Codex finishes `npm install`)

Copy and paste this whole block into Terminal:

```
cd ~/Documents/Claude/Projects/pickleball-score-keeper
npx expo start
```

Then press `i` for the iPhone simulator, or scan the QR code with the Expo Go app on your phone.

## Status
- ✅ All code written; scoring engine has 12 passing rule tests
- ✅ Codex: install dependencies, full typecheck, scoring tests
- ✅ Codex: iPhone simulator smoke test, deuce finish, Save & Done → History
- ✅ Codex: force-quit recovery verified with Resume card
- ✅ Codex: new GitHub remote set to `pickleballscorekeeperapp/app`
- ✅ EAS project is separate from CourtsideView: `@abridegan/pickleball-score-keeper`
- ⏳ Android smoke test (no Android SDK/emulator available on this Mac session)
- ⏳ App Store / Play Store setup (new bundle ID: com.courtsideviewapp.pickleballscorekeeper)
- 🎨 App icons are auto-generated placeholders — fine for testing, we'll design real ones before launch
