# GoblinCave - Name Change Summary

All references have been updated from "Goblin Discord" to "GoblinCave"

## Files Renamed

1. `goblin-discord.html` → `goblincave.html`
2. `goblin-discord.jsx` → `goblincave.jsx`

## Files Updated

### Core App Files
- ✅ `app.json` - Updated name and displayName to "GoblinCave"
- ✅ `package.json` - Updated name to "goblincave" and description
- ✅ `index.js` - No changes needed (uses app.json)
- ✅ `App.js` - No changes needed (no hardcoded names)

### HTML/JSX Files
- ✅ `goblincave.html` - Updated page title to "GoblinCave"
- ✅ `goblincave.jsx` - No changes needed

### Documentation
- ✅ `README.md` - Updated all references
- ✅ `GITHUB-README.md` - Updated all references
- ✅ `GITHUB-SETUP.md` - Updated all references
- ✅ `iOS-SETUP.md` - Updated all references
- ✅ `ANDROID-SETUP.md` - Updated all references
- ✅ `CONTRIBUTING.md` - Updated all references
- ✅ `LICENSE` - Updated copyright holder

### GitHub Files
- ✅ `.github/workflows/build.yml` - Updated all references
- ✅ `.github/ISSUE_TEMPLATE/bug_report.md` - Updated all references
- ✅ `.github/ISSUE_TEMPLATE/feature_request.md` - Updated all references
- ✅ `.github/pull_request_template.md` - Updated all references

## Key Changes Made

### Package Names
- npm package: `goblin-discord` → `goblincave`
- App name: `GoblinDiscord` → `GoblinCave`
- Display name: `Goblin Discord` → `GoblinCave`

### URLs & Repositories
- Repository: `goblin-discord` → `goblincave`
- All GitHub URLs updated
- All documentation links updated

### Branding
- App title changed from "Goblin Discord" to "GoblinCave"
- Description changed from "Discord clone" to "chat application"
- Support email: `support@goblindiscord.com` → `support@goblincave.app`
- Social handles updated to @GoblinCave

## What You Need to Do

When setting up on GitHub or in development:

1. **GitHub Repository**: Create as `goblincave` (not `goblin-discord`)
2. **Clone command**: `git clone https://github.com/YOUR_USERNAME/goblincave.git`
3. **iOS Bundle ID**: Use `com.yourname.goblincave`
4. **Android Package**: Use `com.yourname.goblincave`

## iOS/Android Specific Updates Needed

### iOS (when creating native project)
In Xcode project settings:
- Product Name: `GoblinCave`
- Bundle Identifier: `com.yourname.goblincave`
- Display Name: `GoblinCave`

File locations to update:
- `ios/GoblinCave/Info.plist` → CFBundleDisplayName
- `ios/GoblinCave.xcodeproj` → Project settings

### Android (when creating native project)
In `android/app/build.gradle`:
```gradle
defaultConfig {
    applicationId "com.yourname.goblincave"
    ...
}
```

In `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">GoblinCave</string>
```

Package rename in:
- `android/app/src/main/java/com/goblincave/MainActivity.java`
- `android/app/src/main/java/com/goblincave/MainApplication.java`
- `android/app/src/main/AndroidManifest.xml`

## Verification Checklist

- [x] All markdown files updated
- [x] All JSON config files updated
- [x] All HTML/JSX files renamed and updated
- [x] GitHub workflows updated
- [x] Issue templates updated
- [x] LICENSE updated
- [x] Package.json updated
- [x] App.json updated
- [x] Support/contact info updated
- [x] Social media handles updated

## Notes

- The app is now consistently branded as "GoblinCave"
- All references to it being a "Discord clone" have been changed to "chat application"
- The internal server names and goblin theme remain the same
- No code functionality was changed, only naming/branding

---

**Everything is ready to deploy as GoblinCave!** 🏰⚔️
