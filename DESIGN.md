---
name: LabPilot
description: Labor routines, timers, counters, and references in a calm offline-first workspace.
colors:
  background: "#F4F1EA"
  background-elev: "#FBF8F2"
  background-sunk: "#E7E0D6"
  card: "#FFFDF8"
  foreground: "#18222B"
  foreground-muted: "#56616C"
  foreground-subtle: "#7B8790"
  border: "#DED6CA"
  border-strong: "#C7BDAE"
  focus: "#275D94"
  success: "#2F765B"
  warning: "#AD6E24"
  danger: "#B44858"
  info: "#275D94"
  area-mibi: "#2F7A6A"
  area-haema: "#B44858"
  area-chemie: "#275D94"
  area-histo: "#6D62C3"
  area-general: "#5D6870"
  area-learn: "#AD6E24"
  dark-background: "#0F1318"
  dark-background-elev: "#171D24"
  dark-background-sunk: "#212A33"
  dark-card: "#131A21"
  dark-foreground: "#F5F2EC"
  dark-foreground-muted: "#B8B4AD"
  dark-border: "#2B333C"
typography:
  display:
    fontFamily: "Inter_600SemiBold, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter_600SemiBold, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Inter_600SemiBold, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.27
    letterSpacing: "normal"
  body:
    fontFamily: "Inter_400Regular, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.38
    letterSpacing: "normal"
  label:
    fontFamily: "Inter_500Medium, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.42
    letterSpacing: "0.7px"
  mono:
    fontFamily: "JetBrainsMono_500Medium, ui-monospace, monospace"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  full: "999px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"
  xxxl: "44px"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.card}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "46px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "46px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.info}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "46px"
  status-chip:
    backgroundColor: "{colors.background-elev}"
    textColor: "{colors.foreground-subtle}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "28px"
  action-tile:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "16px"
    height: "128px"
  text-field:
    backgroundColor: "{colors.background-elev}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
---

# Design System: LabPilot

## 1. Overview

**Creative North Star: "Editorial Lab Manual"**

LabPilot should feel like a precise working manual that happens to be interactive: dense enough for real laboratory use, calm enough for beginners, and opinionated enough that users never feel they are assembling their own workspace. The system borrows Apple Health's grouped information density, Linear's professional restraint, and Procreate's willingness to remove chrome when the work surface matters.

The current visual system is warm clinical paper: light, slightly tinted neutrals, restrained borders, Inter typography, monospaced numeric readouts, and area colors used as functional signals. It should not become a generic dashboard, a gamified learning app, a PDF-like medical library, or an Android Material clone.

**Key Characteristics:**
- Warm paper-like light mode as the default physical scene for training rooms and routine labs.
- Dense but readable screen structure with clear sections and immediate actions.
- Tactile, direct controls with visible labels, large tap targets, and minimal confirmation friction.
- Area color as a reference cue, never as decoration or the only state signal.
- Professional restraint: no hype, no playful reward language, no visible setup scaffolding in primary flows.

## 2. Colors

The palette is warm clinical paper: off-white sheets, muted ink, aged separators, and restrained laboratory accents.

### Primary
- **Lab Ink** (#18222B): Primary text and primary button surface. Use it sparingly as the strongest visual authority.
- **Reference Blue** (#275D94): Information, focus, selected navigation, and cross-domain actions. This is the main product accent.

### Secondary
- **Microbiology Teal** (#2F7A6A): Microbiology area cue, standard timer accents, and mibi reference paths.
- **Hematology Rose** (#B44858): Hematology area cue, destructive states, and blood-related counters.
- **Histology Violet** (#6D62C3): Histology area cue only. Keep it rare so it stays useful.
- **Learning Amber** (#AD6E24): Learning, warning, and premium-adjacent emphasis. Do not let it turn the app into a reward system.

### Neutral
- **Warm Paper** (#F4F1EA): Main screen background.
- **Lifted Paper** (#FBF8F2): Subtle elevated background for chips, icon wells, and input fields.
- **Pressed Paper** (#E7E0D6): Pressed states and sunken surfaces.
- **Reference Sheet** (#FFFDF8): Cards, rows, buttons, numeric panels, and compact surfaces.
- **Muted Ink** (#56616C): Secondary explanatory text.
- **Fine Print** (#7B8790): Captions, inactive icons, and low-priority metadata.
- **Hairline Rule** (#DED6CA): Default borders.
- **Instrument Rule** (#C7BDAE): Strong borders and separators around controls.

### Named Rules
**The Warm Paper Rule.** Keep the app light and paper-like unless a screen's physical scene truly calls for dark mode. Dark mode exists, but it is not the product's personality.

**The Accent-As-Index Rule.** Area colors identify discipline, urgency, or state. They do not decorate repeated card grids, and they must always be paired with labels or icons.

## 3. Typography

**Display Font:** Inter 600 SemiBold with system fallback.
**Body Font:** Inter 400 Regular with system fallback.
**Label/Mono Font:** JetBrains Mono 500 for numeric displays and timer values.

**Character:** The type system is compact and practical. Inter carries professional app clarity, while JetBrains Mono makes time, counts, and calculated values feel instrument-like.

### Hierarchy
- **Display** (600, 34px, 40px): Open screen titles and major task surfaces. Use once per screen.
- **Headline** (600, 30px, 36px): Secondary large headers and older h1 surfaces.
- **Title** (600, 22px, 28px): Detail sections and substantial grouped content.
- **Section Title** (600, 18px, 24px): Section headers in working screens.
- **Body** (400, 16px, 22px): Primary explanatory copy, labels, and readable content.
- **Callout** (400, 15px, 21px): Screen descriptions and concise helper text.
- **Label** (500, 12px, 17px, uppercase only when metadata needs it): Eyebrows, chips, numeric labels, and compact metadata.
- **Mono** (500, 17px baseline, scaled up for values): Timer values, counters, and numeric display panels.

### Named Rules
**The One Display Rule.** A screen gets one open display title. Do not add native large titles, hero cards, or competing oversized numbers above it.

**The No Text Wall Rule.** Reference content must be grouped and scannable. Avoid long unbroken paragraphs that make Wissen feel like a PDF viewer.

## 4. Elevation

LabPilot is flat by default and uses tonal layering, borders, and press states more than shadows. Depth should read as paper and instruments resting on a surface, not floating cards. Shadows are allowed only for true elevated cards or navigation chrome, and should stay low-opacity and broad.

### Shadow Vocabulary
- **Ambient Low** (`shadowColor: #121A22; shadowOpacity: 0.06; shadowRadius: 18; shadowOffset: 0 8; elevation: 2`): Rare elevated cards only.
- **Native Tab Separation** (`shadowColor: #C7BDAE`): Navigation separation, especially for iOS native tabs.

### Named Rules
**The Flat-By-Default Rule.** Surfaces rest at the same elevation unless the user is pressing them or the surface is persistent navigation.

## 5. Components

### Buttons
- **Shape:** Medium instrument radius (14px), minimum 46px height, 1px border.
- **Primary:** Lab Ink background with Reference Sheet text. Use for the next meaningful action, not for every action in a section.
- **Secondary:** Reference Sheet background, Instrument Rule border, Lab Ink text.
- **Ghost:** Transparent background with Reference Blue text for low-emphasis navigation or local alternatives.
- **Pressed:** Slight scale down to 0.98 and tonal background change. Keep motion fast and direct.

### Chips
- **Style:** Full pill radius, 28px minimum height, Lifted Paper background, colored border and icon when state matters.
- **State:** Chips are status labels, not marketing badges. Use visible text plus icon or tone, never color alone.

### Cards / Containers
- **Corner Style:** Large or extra-large paper radius, usually 20px to 28px.
- **Background:** Reference Sheet on Warm Paper.
- **Shadow Strategy:** Flat by default. Ambient Low only when the surface needs true separation.
- **Border:** 1px Hairline Rule or Instrument Rule. Colored side stripes are current design debt and should not be extended.
- **Internal Padding:** 16px for compact rows, 20px for cards, 24px to 32px for open screen rhythm.

### Inputs / Fields
- **Style:** Visible label above the input, Lifted Paper background, 1px Instrument Rule border, 14px radius, 48px minimum height.
- **Focus:** Use Reference Blue or Focus Blue border treatment. Do not remove visible focus.
- **Error / Disabled:** Error copy appears below the field in Hematology Rose and remains associated with the field.

### Navigation
- **Style:** Native tabs where available, warm elevated background, selected state in Reference Blue, inactive state in Fine Print.
- **Behavior:** Disable transparent scroll-edge behavior on tab roots. Root screens use custom open headers, not nested native large titles.
- **Android:** Use the same LabPilot visual language, not Material-specific color, FAB, or ripple conventions.

### Action Tiles
- **Character:** Compact, tactile entry points for common actions.
- **Shape:** 14px radius, 1px Instrument Rule border, 128px minimum height, 16px padding.
- **Accent:** Prefer top accent or icon well treatment over colored side stripes. Use area color to index the action.

### Resource Rows
- **Character:** Catalog entries for protocols, references, and libraries.
- **Shape:** 78px minimum height, icon well, title, metadata, and trailing affordance.
- **Debt:** Existing left accent stripes should be replaced with top accents, icon wells, badges, or full-border treatment.

### Numeric Displays
- **Character:** Instrument readouts for time, counts, and calculated values.
- **Shape:** Reference Sheet background, Instrument Rule border, 14px radius, centered mono value.
- **Label:** Uppercase label above the value, paired in accessibility text as `Label: Value`.

## 6. Do's and Don'ts

### Do:
- **Do** use Warm Paper (#F4F1EA), Lifted Paper (#FBF8F2), and Reference Sheet (#FFFDF8) as the dominant light-mode stack.
- **Do** keep tap targets at least 44px and prefer 46px or larger for working controls.
- **Do** use JetBrains Mono for timer, count, and calculated readouts.
- **Do** make counters and active timers feel like instruments, with large targets and minimal chrome.
- **Do** group dense reference information like Apple Health: readable at a glance, expandable by intent, never overwhelming by default.
- **Do** pair every color-coded area or state with visible text, iconography, or both.
- **Do** keep setup, store, sync, and entitlement messages quiet unless the user is in a relevant flow.

### Don't:
- **Don't** use border-left or border-right greater than 1px as a colored accent on cards, rows, callouts, or alerts. Existing side stripes are debt.
- **Don't** build generic dashboard pages with interchangeable cards, fake metrics, or decorative stats.
- **Don't** make LabPilot feel like Notion or Obsidian. It is not a blank canvas or configurable workspace.
- **Don't** add gamification patterns from MyFitnessPal or Lifesum: no streak badges, confetti, playful rewards, or motivational noise.
- **Don't** make Wissen feel like Medscape, Amboss, or a PDF viewer. Avoid dense text walls and slow encyclopedia browsing.
- **Don't** use Material-style FABs, loud ripple choreography, or Android-specific visual compromises.
- **Don't** expose technical setup language such as missing keys, backend configuration, demo data, or placeholder content in primary product surfaces.
- **Don't** imply LabPilot is a medical device, diagnostic authority, or replacement for validated laboratory processes.