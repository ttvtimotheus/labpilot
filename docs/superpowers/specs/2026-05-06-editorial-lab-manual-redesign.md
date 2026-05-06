# Editorial Lab Manual Redesign

## Goal

Rebuild the LabPilot UI so it stops reading like a scaffolded mini-dashboard and instead feels like a precise, curated laboratory working manual.

The redesign must:

- remove the current repetitive grammar of `hero card + stat tiles + list rows`
- make the app feel intentional and product-like rather than assembled from interchangeable components
- keep the app clinically calm, bright, and professional
- present starter content as an integrated standard library rather than fake user data
- reduce the visual prominence of setup, offline, and monetization states unless they are directly relevant

## Current Problems

### Repetition

The major screens currently share the same structure:

- a boxed header card
- 2 metric tiles
- one or more list sections made of the same row primitive

This makes Home, Timer, Wissen, Settings, Pro, and modal surfaces feel nearly identical.

### Over-containerization

Too many borders, boxes, and panels compete for attention. The interface feels dense and manufactured instead of deliberate.

### Weak content hierarchy

Core app content, helper text, setup messaging, and monetization information are too close in visual weight.

### Prototype signals

Offline/setup/store states still appear as structural UI features rather than background states. Standard library data is visible, but not framed as such.

## Design Direction

### Visual language

Use an editorial manual aesthetic:

- open screen headers with strong typography and minimal framing
- fewer boxes and more controlled whitespace
- accent colors used sparingly and with purpose
- surfaces that feel like sheets, instruments, and references rather than dashboard widgets
- clear separation between active work, library content, and system settings

### Content model

- active/living content should feel immediate and operational
- reference/library content should feel curated and durable
- settings/system content should feel quiet and utilitarian
- Pro and store content should feel secondary and orderly, not like an unfinished business screen

## Component Strategy

### Retire as default patterns

These components should no longer define the visible grammar of the app:

- current `PageHeader`
- current `MetricTile`
- current overused `ListRow` as the default row for every context

They may remain in code temporarily, but the new UI should not rely on them as the dominant expression.

### New primitives

1. `ScreenHeader`
   - open header without card framing
   - supports eyebrow, title, summary, optional compact actions
   - can optionally include inline chips or a secondary line

2. `StatusChip`
   - compact label pill for states like local, sync, pro, reference, standard
   - low emphasis by default

3. `ActionTile`
   - dense tappable tile for high-value primary actions
   - stronger visual mass than a button, but calmer than a card

4. `ResourceRow`
   - used for library/reference/protocol entries
   - should feel like a catalog row, not a generic settings row

5. `LiveItemRow`
   - used for timers and in-progress content
   - should visually prioritize live status and timing over general metadata

6. `NoticeBanner`
   - used for offline/store/setup states
   - visually subordinate to core content

### Existing primitives to revise

- `Button`: cleaner, less pill-heavy, more instrument-like
- `Card`: use only when true grouping is needed
- `EmptyState`: calmer and less ornamental
- `Screen`: spacing tuned for open layouts, not stacked cards
- `Section`: lighter framing, less caption-like shouting

## Screen-by-Screen Plan

### Home

Purpose:

- orient the user
- surface what is active now
- provide the fastest path into work

New structure:

1. open top header with app name and concise value statement
2. compact local/cloud state chip if relevant
3. current focus block for active timers or immediate next action
4. action grid for Timer, Protokolle, Wissen, Zaehler
5. integrated standard library teaser, not fake “recent product” content

Avoid:

- oversized hero card
- stats as decorative filler

### Timer

Purpose:

- operational working screen

New structure:

1. open header with one primary action
2. active timers first and visually strongest
3. starter modules for common timers as structured action tiles
4. standard timer library as catalog rows
5. recent runs as subdued secondary history

### Protokolle

Purpose:

- present standard operating procedures as a protocol library

New structure:

1. editorial header framing this as the standard protocol library
2. protocol library rows with stronger metadata hierarchy
3. recent runs/exports as a separate historical band
4. export messaging as quiet inline notice, not headline content

### Wissen

Purpose:

- curated laboratory reference library

New structure:

1. library header
2. discipline chooser styled differently from tools and reference assets
3. reference library band for Normalwerte and Nährmedien
4. tools band with more instrument-like action tiles
5. training band clearly separated from reference content

### Bereich Screen

Purpose:

- subsection landing page for a discipline

New structure:

1. simple header
2. optional chip for area
3. article list with clear distinction between standard and Pro content
4. empty state phrased as unavailable library content rather than future placeholder

### Topic Screen

Purpose:

- readable article view

New structure:

1. open article header
2. body sections as readable sheets or paragraphs
3. Pro gating handled with a quiet premium notice and CTA, not placeholder wording

### Settings

Purpose:

- operational preferences, not marketing

New structure:

1. quiet settings header
2. grouped utility sections
3. inline preference selectors that do not dominate the screen
4. Pro entry only when relevant

### Account

Purpose:

- identity and sync utility

New structure:

1. small header with status chips
2. account summary
3. sync block
4. destructive/logout actions visually separated

### Subscription and Paywall

Purpose:

- explain premium value without breaking product tone

New structure:

1. premium header without oversized promotional treatment
2. concise capability list
3. store status as secondary information
4. package cards only if real offerings exist

## Content Rules

### Standard content framing

Default timer templates, protocols, and references must be described as:

- standard library
- integrated references
- default protocol catalog

They must not read as mock or demo user content.

### Setup/configuration messaging

Do not show technical setup language unless the user is already inside a settings or purchase flow.

Examples to avoid in primary surfaces:

- not configured
- missing keys
- build version specific wording
- placeholder/future language

Use product-facing alternatives:

- currently unavailable on this device
- local only in this installation
- store options not visible right now

## Accessibility and UX Constraints

- preserve visible labels on controls
- maintain adequate contrast with the revised palette
- keep tap targets at least 44px
- do not hide important state only in color
- preserve predictable reading order
- keep layouts readable at narrow widths without horizontal scroll

## Implementation Sequence

1. revise theme tokens and spacing rhythm
2. replace or rewrite shared primitives
3. update tab shell styling if needed
4. redesign Home, Timer, Protokolle, Wissen
5. redesign Bereich and Topic screens
6. redesign Settings, Account, Subscription, Paywall, Sign-in
7. run focused tests
8. run typecheck
9. run iOS bundle/export validation

## Done Criteria

- Home, Timer, Wissen, and Settings no longer share the same visual grammar
- the UI reads as a coherent product rather than a component demo
- standard library content no longer feels like mock data
- setup/store/offline states are quieter and more contextual
- typecheck passes
- relevant tests pass
- iOS bundle/export succeeds