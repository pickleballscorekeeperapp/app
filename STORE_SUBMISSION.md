# Pickleball Score Keeper Store Submission Notes

## Separation From CourtsideView

- Expo/EAS project: `@abridegan/pickleball-score-keeper`
- EAS project ID: `6f29222e-67f0-411b-851b-32e23775487e`
- CourtsideView EAS project for comparison: `@abridegan/courtsideview` (`d509ab09-9984-431d-bbfc-0856f25d87b6`)
- iOS bundle ID: `com.courtsideviewapp.pickleballscorekeeper`
- Android package: `com.courtsideviewapp.pickleballscorekeeper`
- Git repo: standalone local repo at this project root
- GitHub remote: `https://github.com/pickleballscorekeeperapp/app.git`
- Shared account-level credentials may be reused. App-specific IDs, App Store Connect records, EAS project IDs, and git remotes must not be copied from CourtsideView.
- Launch scope: iPhone-only for the first App Store submission. Enable iPad later only after iPad layouts and App Store screenshots are prepared.
- Before builds/submits, run `npm run release:check-boundary` to verify the project is still pointed at the Pickleball repo, bundle IDs, and EAS project.

## Accounts & Contacts

- Apple Developer account: `abridegan@gmail.com`
- Apple Team: `C79KBB944T` (`ADAM LEE BRIDEGAN (Individual)`)
- App/support email: `pickleballscorekeeperapp@proton.me`

## Store Metadata

- App name: `Pickleball Score Keeper`
- Subtitle: `Official side-out scoring`
- Category: Sports
- Privacy: Data Not Collected
- Tracking: No
- Network calls: None in v1
- Accounts/login: None in v1
- Runtime permissions: None requested intentionally
- In-app attribution: home screen footer says `Powered by CourtsideView`

## Internal Testing Targets

- Apple: App Store Connect app record plus TestFlight internal testers.
- Android: Google Play Console app record plus internal testing track.

## EAS Build Artifacts

- Production iOS builds create App Store/TestFlight `.ipa` files.
- Production Android builds create Play Store `.aab` files.
- EAS remote versioning is enabled, so `ios.buildNumber` and `android.versionCode` are managed by EAS.
- Same EAS owner as CourtsideView is acceptable. Confirm `eas project:info` shows `@abridegan/pickleball-score-keeper`, not `@abridegan/courtsideview`, before any build or submit.

### Current Internal-Test Builds

- Android AAB
  - EAS build ID: `a5254fe0-6b17-4aad-b216-bf77949587c9`
  - Version: `1.0.0`
  - Version code: `2`
  - Local artifact: `builds/pickleball-score-keeper-android-1.0.0-2.aab`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/a5254fe0-6b17-4aad-b216-bf77949587c9`
  - Status: obsolete because it uses the previous package ID `com.houseofturnberry.pickleballscorekeeper`.
- iOS IPA
  - EAS build ID: `19678d11-0d4e-472b-8629-ab005cbc9af0`
  - Version: `1.0.0`
  - Build number: `3`
  - Local artifact: `builds/pickleball-score-keeper-ios-1.0.0-3.ipa`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/19678d11-0d4e-472b-8629-ab005cbc9af0`
  - Status: obsolete for App Store submission after Apple's April 28, 2026 SDK cutoff and because it uses the previous bundle ID `com.houseofturnberry.pickleballscorekeeper`.
- iOS IPA
  - EAS build ID: `f34a68f4-98cc-4e97-b0a1-bd8fae6e93c7`
  - Version: `1.0.0`
  - Build number: `4`
  - Local artifact: `builds/pickleball-score-keeper-ios-1.0.0-4.ipa`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/f34a68f4-98cc-4e97-b0a1-bd8fae6e93c7`
  - IPA URL: `https://expo.dev/artifacts/eas/lXhYfr74hwTnu0mGDbpu6oM-sAoh6etO4NkXu_JBmSk.ipa`
  - Status: obsolete because it uses the previous bundle ID `com.houseofturnberry.pickleballscorekeeper`.
- iOS IPA
  - EAS build ID: `9df711ae-ff8d-499c-b393-1d4b27026532`
  - Version: `1.0.0`
  - Build number: `5`
  - Commit: `25f2b30cd8bec3752bf50b6e2a5ff49500052db1`
  - Local artifact: `builds/pickleball-score-keeper-ios-1.0.0-5.ipa`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/9df711ae-ff8d-499c-b393-1d4b27026532`
  - IPA URL: `https://expo.dev/artifacts/eas/8P_8uLAMMNHgcZbjt3hCtFAR4sFRSUR8qU4Y9rXExZI.ipa`
  - Status: obsolete because it uses the previous bundle ID `com.houseofturnberry.pickleballscorekeeper`. Rebuild before App Store Connect submission.

### Submission Status

- Android: EAS automated submit was attempted for the `internal` track and failed because Google requires the first submission of a new app to be performed manually in Play Console.
- iOS: EAS automated submit is ready once the Pickleball App Store Connect app exists and its `ascAppId` is added to `eas.json`.

## Remaining Console Setup

1. Run `npm run release:check-boundary`.
2. Create the Apple App Store Connect app record for the Pickleball bundle ID `com.courtsideviewapp.pickleballscorekeeper`.
3. Add the resulting Pickleball `ascAppId` to `eas.json` under `submit.production.ios` if EAS cannot auto-detect it by bundle ID.
4. Run a fresh iOS production build with the `com.courtsideviewapp.pickleballscorekeeper` bundle ID, then submit that build to App Store Connect/TestFlight.
5. Create the Google Play Console app record for the Pickleball package name `com.courtsideviewapp.pickleballscorekeeper`.
6. Run a fresh Android production build with the `com.courtsideviewapp.pickleballscorekeeper` package ID, then upload it to the `internal` track.
7. Add internal testers in App Store Connect/TestFlight and Google Play Console.
