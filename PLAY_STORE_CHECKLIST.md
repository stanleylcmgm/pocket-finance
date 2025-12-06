# Google Play Store Publishing Checklist

Use this checklist to track your progress through the publishing process.

## Pre-Build Checklist

- [ ] Google Play Console account created ($25 fee paid)
- [ ] Expo account created and logged in (`eas login`)
- [ ] EAS CLI installed globally (`npm install -g eas-cli`)
- [ ] App configuration reviewed and updated
- [ ] Privacy Policy URL ready (REQUIRED for AdMob apps)
- [ ] Store listing assets prepared:
  - [ ] App icon (512x512px PNG)
  - [ ] Feature graphic (1024x500px PNG)
  - [ ] Screenshots (at least 2, recommended 4-8)
  - [ ] Short description (80 chars max)
  - [ ] Full description (4000 chars max)

## Build Checklist

- [ ] Run `eas build --platform android --profile production`
- [ ] Build completed successfully
- [ ] AAB file downloaded from EAS dashboard
- [ ] Keystore credentials saved securely (if EAS generated new one)

## Google Play Console Setup

- [ ] App created in Play Console
- [ ] Store listing completed:
  - [ ] App name
  - [ ] Short description
  - [ ] Full description
  - [ ] App icon uploaded
  - [ ] Feature graphic uploaded
  - [ ] Screenshots uploaded
  - [ ] Privacy Policy URL added
- [ ] App content completed:
  - [ ] Privacy Policy declared
  - [ ] Target audience selected
  - [ ] Content rating questionnaire completed
  - [ ] Data safety form completed
- [ ] Pricing and distribution configured:
  - [ ] Countries/regions selected
  - [ ] Content guidelines accepted

## Testing Checklist

- [ ] Internal testing release created
- [ ] AAB uploaded to internal testing track
- [ ] Testers added
- [ ] App tested on physical device(s)
- [ ] All features verified working:
  - [ ] App launches correctly
  - [ ] AdMob ads display (test ads disabled)
  - [ ] In-app purchases work (if applicable)
  - [ ] Database operations work
  - [ ] No crashes or major bugs

## Production Submission

- [ ] Production release created
- [ ] AAB uploaded to production track
- [ ] Release notes written
- [ ] All sections reviewed and complete
- [ ] App submitted for review
- [ ] Review status monitored

## Post-Launch

- [ ] App approved and published
- [ ] App appears in Play Store search
- [ ] Analytics monitoring set up
- [ ] User reviews being monitored
- [ ] Crash reports being monitored

## Notes

- **Review Time**: Usually 1-7 days for first submission
- **Version Updates**: Remember to increment `versionCode` in `app.json` for each release
- **Privacy Policy**: Must be accessible and cover AdMob data collection
- **Keystore**: Keep credentials safe - you'll need them for all future updates

---

**Current Status**: Not Started
**Last Updated**: [Date]

