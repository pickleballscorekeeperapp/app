# Easy Pickleball Scoreboard Store Submission Notes

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

- App name: `Easy Pickleball Scoreboard`
- App Store Connect app ID: `6785500385`
- Subtitle: `Official side-out scoring`
- Category: Sports
- Privacy: App Privacy completed for free app with Google AdMob banner ads and the published privacy policy.
- Tracking: No ATT prompt; ads request non-personalized traffic and app code caps ad content rating at General Audiences.
- Network calls: Google Mobile Ads SDK banner ad requests in production.
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
- Apple provisioning profile for `com.courtsideviewapp.pickleballscorekeeper`: `3CPS73H49L`, active, expires Sun, 02 May 2027 09:45:49 EDT.

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
- iOS IPA
  - EAS build ID: `891d1bdb-ae58-460d-a298-c59155b9500f`
  - Version: `1.0.0`
  - Build number: `2`
  - Commit: `5f65c0f5f92dfe6c49cfdeef0477a6350211face`
  - Local artifact: `builds/pickleball-score-keeper-ios-1.0.0-2-courtsideviewapp.ipa`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/891d1bdb-ae58-460d-a298-c59155b9500f`
  - IPA URL: `https://expo.dev/artifacts/eas/glaPKcDxtYF-WFPmkMBCL2erQmGcq4eTAeycK9nMnNA.ipa`
  - Status: obsolete because the App Store product name changed to `Easy Pickleball Scoreboard`; rebuild with the updated display name before submission.
- iOS IPA
  - EAS build ID: `d55c9600-1572-4383-a646-2aa1aec37acd`
  - Version: `1.0.0`
  - Build number: `3`
  - Commit: `53a0bd42c9304b715d3f7f7733d97c3fa2ab6739`
  - Local artifact: `builds/easy-pickleball-scoreboard-ios-1.0.0-3.ipa`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/d55c9600-1572-4383-a646-2aa1aec37acd`
  - IPA URL: `https://expo.dev/artifacts/eas/5yvv0b9ptZZEUzBCLD-yjwiGCzFj8Wz9VpZNYC8N2qk.ipa`
  - EAS submission ID: `b3576203-f84e-4b70-98bd-0acee1249838`
  - TestFlight page: `https://appstoreconnect.apple.com/apps/6785500385/testflight/ios`
  - Status: superseded by build `4`, which adds the landscape scoreboard mode.
- iOS IPA
  - EAS build ID: `662f7a7e-1885-47e5-8825-13df0c53b1ff`
  - Version: `1.0.0`
  - Build number: `4`
  - Commit: `9e581bd`
  - Local artifact: `builds/easy-pickleball-scoreboard-ios-1.0.0-4-landscape.ipa`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/662f7a7e-1885-47e5-8825-13df0c53b1ff`
  - IPA URL: `https://expo.dev/artifacts/eas/2s7-dpf83kjGxT77oxKwDELZbqMhfzHU2aROlx4W3CU.ipa`
  - App Store Connect build upload ID: `9596df89-48df-4d63-88f1-87cc8c316c81`
  - TestFlight page: `https://appstoreconnect.apple.com/apps/6785500385/testflight/ios`
  - Status: superseded by build `6`, which adds the final Savoye wordmark home treatment.
- iOS IPA
  - EAS build ID: `b999d051-d02d-4f99-9696-a4ca5cbbe0d4`
  - Version: `1.0.0`
  - Build number: `5`
  - Commit: `f472d5aa28912a352cd3b687ff60a63fbbc25410`
  - Local artifact: not retained as release candidate
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/b999d051-d02d-4f99-9696-a4ca5cbbe0d4`
  - IPA URL: `https://expo.dev/artifacts/eas/jEgU2uXyRb5n17HcElLlN7MP9Iw0GddRHwYRAATQSt8.ipa`
  - Status: superseded by build `6`, which adds the final Savoye wordmark home treatment.
- iOS IPA
  - EAS build ID: `71d1c9a5-03bc-4034-bf9d-6b870e15d55a`
  - Version: `1.0.0`
  - Build number: `6`
  - Commit: `2e1d35ff931182c65c8f62ebe9d082d77708ca2d`
  - Local artifact: `builds/easy-pickleball-scoreboard-ios-1.0.0-6-savoye-wordmark.ipa`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/71d1c9a5-03bc-4034-bf9d-6b870e15d55a`
  - IPA URL: `https://expo.dev/artifacts/eas/vtTdQW3fkl8n88stVuLJNRei_pVpkL8G016EGVNnTu0.ipa`
  - App Store Connect delivery UUID: `62371b06-2afa-4353-8fc3-b81c4fb289c6`
  - TestFlight page: `https://appstoreconnect.apple.com/apps/6785500385/testflight/ios`
  - Status: superseded by build `8`, which adds the AdMob banner integration and final App Privacy disclosures.
- iOS IPA
  - EAS build ID: `32f8536d-8e12-415f-bdb8-74577548dcf6`
  - Version: `1.0.0`
  - Build number: `8`
  - Local artifact: `build-artifacts/EasyPickleballScoreboard-1.0.0-8.ipa` (ignored by git)
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/32f8536d-8e12-415f-bdb8-74577548dcf6`
  - IPA URL: `https://expo.dev/artifacts/eas/ycB4pws-zX8KHBVVCpJQ6UqHPTlj6AWv4eROIC0Secw.ipa`
  - App Store Connect delivery UUID: `1e814a6f-d6c8-4207-b83e-ca30b7515ee3`
  - Status: submitted to App Store Review on June 29, 2026; App Store Connect shows `Waiting for Review`.

### Submission Status

- Android: EAS automated submit was attempted for the `internal` track and failed because Google requires the first submission of a new app to be performed manually in Play Console.
- iOS: Build `8` was uploaded to App Store Connect, attached to iOS version `1.0`, and submitted for Apple review. App Store Connect shows `Waiting for Review`.

## Remaining Console Setup

1. Monitor App Store Connect and the Apple Developer email for review status or metadata questions.
2. Add internal testers in App Store Connect/TestFlight if desired.
3. Create the Google Play Console app record for the Pickleball package name `com.courtsideviewapp.pickleballscorekeeper`.
4. Run a fresh Android production build with the `com.courtsideviewapp.pickleballscorekeeper` package ID, then upload it to the `internal` track.
