# Zintsomi Product Roadmap (Living Document)

This roadmap turns your product vision into clear, buildable stages.

## How to use this roadmap

- Work from Stage 1 → Stage 8 in order unless there is an emergency fix.
- Keep each stage as a standalone milestone with a demo/checkpoint.
- Mark progress with: `Not started` / `In progress` / `Done`.
- Ship thin slices first (minimum lovable version), then iterate.

---

## Stage 1 — Stabilize Core Experience
**Goal:** Ensure first load is fast and reliable, especially on mobile networks.

**Why first:** If loading fails, nothing else matters.

### Tasks
- [ ] Confirm loading behavior on low-end Android and iOS devices.
- [ ] Replace long blocking loaders with progressive loading states.
- [ ] Audit image/video assets and compress oversized media.
- [ ] Add graceful fallback UI when content fetch fails.
- [ ] Add simple performance baseline (First Contentful Paint / Time to Interactive).

**Exit criteria:** New users can load core screens consistently in real-world mobile conditions.

---

## Stage 2 — Mobile-First UX Fix
**Goal:** Make the app feel intentionally designed for phones.

**Why second:** Most users will arrive on mobile.

### Tasks
- [ ] Audit every major page at 360px, 390px, and 430px widths.
- [ ] Improve tap-target sizing and spacing for thumbs.
- [ ] Ensure bottom navigation is always reachable and not obscured.
- [ ] Fix text truncation/overflow on cards and headings.
- [ ] Test portrait + landscape behavior for interactive screens.

**Exit criteria:** No critical layout breaks across primary mobile breakpoints.

---

## Stage 3 — Guided Onboarding
**Goal:** Remove first-session confusion and guide users to a successful first action.

**Why third:** Early clarity strongly influences retention.

### Tasks
- [ ] Add a lightweight “welcome path” that introduces core worlds/features progressively.
- [ ] Ask 2–3 preference questions (language, interests, age/learning level).
- [ ] Set a “first win” target (e.g., complete one mini lesson/challenge).
- [ ] Add tooltips/hints only when needed; avoid cognitive overload.
- [ ] Track onboarding completion and first-session drop-off points.

**Exit criteria:** Most users can explain what to do next within their first minute.

---

## Stage 4 — Real Streak System (Retention Engine)
**Goal:** Turn the current streak display into a real persisted habit loop.

**Why fourth:** High-impact retention feature once onboarding exists.

### Tasks
- [ ] Persist streak count per user in backend storage.
- [ ] Define streak rules (daily window, timezone behavior, missed-day handling).
- [ ] Add streak protection/freeze rules (optional).
- [ ] Add celebratory feedback for milestones (3, 7, 14, 30 days).
- [ ] Surface streak status in home, profile, and notifications.

**Exit criteria:** Streaks are accurate, saved, and visible across sessions/devices.

---

## Stage 5 — Language Toggle (isiZulu / isiXhosa / Sesotho / English)
**Goal:** Make language choice a first-class product feature.

**Why fifth:** Deep differentiation and cultural accessibility.

### Tasks
- [ ] Build localization architecture (keys, namespaces, fallback logic).
- [ ] Add global language switch in onboarding + settings.
- [ ] Translate highest-traffic UI first (navigation, onboarding, key actions).
- [ ] Validate language quality with native/community reviewers.
- [ ] Add basic RTL/long-text safety checks where needed.

**Exit criteria:** Users can switch languages instantly with meaningful translated coverage.

---

## Stage 6 — Notification & Re-Engagement Loop
**Goal:** Bring users back intentionally without spam.

### Tasks
- [ ] Define reminders for learning/streak maintenance.
- [ ] Personalize prompts by behavior (inactive, progressing, milestone reached).
- [ ] Add notification preferences and quiet hours.
- [ ] Measure open rate and next-session conversion.

**Exit criteria:** Re-engagement improves while opt-outs remain healthy.

---

## Stage 7 — Content Depth & Progression
**Goal:** Expand educational/cultural content with clear progression.

### Tasks
- [ ] Introduce level paths and prerequisite chains.
- [ ] Add unlock system tied to completion and mastery.
- [ ] Add progress map for “what’s next.”
- [ ] Review content quality and cultural authenticity continuously.

**Exit criteria:** Users can see a clear long-term journey and progression path.

---

## Stage 8 — Social & Community Multipliers
**Goal:** Add social features that reinforce daily learning behavior.

### Tasks
- [ ] Introduce friend activity feed and lightweight encouragement.
- [ ] Add cooperative or challenge-based events.
- [ ] Build safe moderation flows and reporting tools.
- [ ] Highlight community wins and cultural moments.

**Exit criteria:** Social mechanics increase return visits and learning completion.

---

## Suggested operating cadence

- **Weekly:** Ship one thin, testable slice.
- **Biweekly:** Review product metrics and adjust priorities.
- **Monthly:** Retrospective by stage (what shipped, what moved KPIs, what to cut).

## Core KPIs to track across stages

- Day-1 / Day-7 retention
- Onboarding completion rate
- Streak adoption rate and average streak length
- Session frequency per user
- Language switch usage and satisfaction

