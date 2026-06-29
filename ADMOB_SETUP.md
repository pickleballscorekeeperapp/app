# AdMob Setup for Easy Pickleball Scoreboard

The app is free on the App Store and monetizes with Google AdMob banner ads.

## Create the AdMob app

1. Go to https://apps.admob.com and sign in with the account that should receive ad revenue.
2. Add an iOS app.
3. Use the App Store Connect app/bundle details:
   - App name: Easy Pickleball Scoreboard
   - Bundle ID: `com.courtsideviewapp.pickleballscorekeeper`
4. Copy the iOS AdMob App ID. It looks like:
   - `ca-app-pub-0000000000000000~0000000000`

## Create the banner ad unit

1. Inside the AdMob app, create a Banner ad unit.
2. Name it something clear, such as `iOS Home/Game Banner`.
3. Copy the banner Ad Unit ID. It looks like:
   - `ca-app-pub-0000000000000000/0000000000`

## Add IDs to EAS

These IDs are public app configuration, not passwords. Add them to the production EAS environment:

```bash
eas env:create --environment production --name EXPO_PUBLIC_ADMOB_IOS_APP_ID --value "ca-app-pub-...~..." --visibility plain
eas env:create --environment production --name EXPO_PUBLIC_ADMOB_IOS_BANNER_UNIT_ID --value "ca-app-pub-.../..." --visibility plain
```

Production iOS builds intentionally fail until both values are present.

## App Store Connect submission status

Because the app now shows ads, App Store Connect was updated before review:

- App Information > Age Rating: advertising was disclosed.
- App Privacy: Google AdMob data disclosures were completed.
- Privacy Policy URL is already updated and deployed:
  `https://easy-pickleball-scoreboard.pages.dev/privacy/`
- The iOS 1.0 submission using build 8 was submitted on June 29, 2026 and is `Waiting for Review`.

The app currently requests non-personalized ads by default. If we later enable personalized ads, we should add an App Tracking Transparency prompt and update App Privacy accordingly.
