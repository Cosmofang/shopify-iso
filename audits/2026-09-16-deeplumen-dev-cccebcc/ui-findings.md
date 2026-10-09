# Deeplumen dev — BFS UI/UX audit

> Report version: `1.0.0`
> Last modified: `2026-09-16 08:36 UTC`
> Last editor: `Codex (OpenAI), UI audit agent`
> Target: user-owned `deepLumendev/shopify-deeplumen-app`, `dev`, commit `cccebcc9c7256a40d68cd6d7cd210761221bdf88`
> Local checkout: `/tmp/shopify-deeplumen-bfs-20260916.4YK5eB/repo`
> Official sources verified this revision: [BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements), [Marketing](https://shopify.dev/docs/apps/design/user-experience/marketing), [Onboarding](https://shopify.dev/docs/apps/design/user-experience/onboarding), [Alerts](https://shopify.dev/docs/apps/design/user-experience/alerts), [Accessibility](https://shopify.dev/docs/apps/build/accessibility), [Modal](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal), [App Bridge Modal API](https://shopify.dev/docs/api/app-bridge-library/apis/modal).

Read-only UI review of the above checkout. No merchant data or production actions were used. One synthetic, isolated evaluation of the real review-prompt function was run. No application files were changed. This is code evidence, not an authenticated Shopify desktop/mobile visual audit; all runtime and reviewer-only outcomes remain unverified.

Paths below are relative to `apps/shopify-app/`. Findings distinguish official BFS rejection criteria from related official design guidance. Priority P2 means a concrete defect to resolve in this iteration; it is not an assertion about Shopify's eventual review decision.

## Findings

### UI-01 — P2 — Dismissing a review promotion only suppresses it for 30 days

- Applicable official hard requirement: [BFS 4.3.6, Dismissible ads](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#436-dismissible-ads), rejection reason 2: dismissed same **or similar** promotional content later reappears.
- Supporting official guidance: [Marketing — Promotion](https://shopify.dev/docs/apps/design/user-experience/marketing#promotion) explicitly includes requests to rate the app in promotional messages, and says dismissed information should not display for the same user again.
- Primary code: `app/lib/review-prompt.server.ts:155-160`; the duration is defined at line 12. Different review triggers remain available at lines 163-180.
- Write path: `app/routes/app._index.tsx:410-420` persists a timestamp and consumes only the current trigger. It does not persist a durable opt-out from similar review requests.
- Trigger: dismiss the 1,000-visit review card; more than 30 days later reach 5,000 visits, or satisfy another unconsumed review trigger. The same type of review promotion returns.
- Synthetic verification: evaluated the real `evaluateReviewPrompt` function after TypeScript stripping, using synthetic dates and metrics. With `reviewVisitsMilestoneShown=1000`, `aiVisits=5000`, no native review history: 29 days after dismissal returned `null`; 31 days returned `{reason:"visits", milestone:5000, ...}`.
- Correction: persist a durable merchant/user dismissal across this review-promotion family. Keep the native Reviews API's frequency limits separate: those limits do not give the custom promotion permission to reappear after dismissal.
- Status: `fail` from source and isolated function execution. Authenticated end-to-end rendering is unverified.

### UI-02 — P2 — Welcome progress announces “Sync Complete” without observing a sync

- Applicable official requirement: [BFS 4.2.2, Helpful onboarding](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#422-helpful-onboarding), and Section 4's requirement that design not leave merchants misled.
- Supporting official guidance: [Onboarding](https://shopify.dev/docs/apps/design/user-experience/onboarding#guidance) describes guiding merchants to completion and progress that represents setup steps. [Alerts — Success](https://shopify.dev/docs/apps/design/user-experience/alerts#success) says success feedback informs merchants when a task completed successfully.
- Primary code: `app/routes/app.sync.tsx:345-355` calculates progress solely from elapsed time; line 100 hardcodes 3 seconds. Lines 392-405 change to complete after another 400 ms. Lines 578-579 visibly say `Sync Complete`.
- Server evidence: the loader at `app/routes/app.sync.tsx:126-140` only ensures a shop row, checks authorization and onboarding state, and returns a destination. `app/lib/onboarding.server.ts:551-558` confirms `ensureOnboardingShop` is only a database upsert. The page specifically renders while state is `pending`.
- Trigger: a merchant reaches `/app/sync` while onboarding is pending. Waiting about 3.4 seconds shows 100% / `Sync Complete`, even before clicking the CTA and, for the initial CPS flow, before approving the feature's billing authorization. No actual scan result is consulted.
- Impact: a merchant sees an apparent successful setup result while real setup may still be pending. This is a definite truthfulness defect in the progress UI; BFS mapping is the general onboarding/trust rule, not a fabricated official prohibition on a particular timer duration.
- Correction: show truthful welcome/preparation text without a fake completion percentage, or bind progress/completion to actual server work and expose pending/failed states. Reserve “Sync Complete” for a confirmed completed sync.
- Status: `fail` from deterministic state flow. Live installation/setup behavior remains unverified.

### UI-03 — P2 — AI Traffic promises an external AI-answer timeline

- Official hard requirement: [BFS 4.3.1, Don't make false claims](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#431-dont-make-false-claims): don't guarantee, promise, or strongly suggest merchant outcomes.
- Primary code: `app/routes/app.ai-traffic.tsx:392-395`: `new products take 1 week to start appearing in AI answers`.
- Related occurrence: `app/routes/app.ai-traffic.tsx:255-265`, when attributed orders are zero, says `AI orders are on the way`.
- Trigger: view AI Traffic with no recorded traffic; the first statement is an unconditional empty-state string, not a measured merchant-specific outcome. For a shop with visits but zero attributed orders, the second statement suggests future orders despite only having evidence of zero.
- Impact: crawler access and app-generated pages do not establish inclusion in third-party AI answers or future orders. The one-week wording presents an external outcome as expected fact.
- Correction: report recorded state and explain that crawling, indexing, recommendations and orders vary and are not guaranteed. For example: “No AI crawler visits recorded yet” and “No AI-referred orders recorded in this period.”
- Status: `fail` from rendered source copy. No claim is made about the actual commercial performance of the app.

### UI-04 — P2 — Decorative AI Traffic animations start and replay without a task action

- Official hard criterion: [BFS 4.3.3, Don't distract merchants](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#433-dont-distract-merchants), rejection reason 3: “Animation is used to draw attention and is unrelated to a merchant action.”
- Primary code: `app/components/store-traffic/PlatformChips.tsx:80-87` starts/restarts via intersection, and `:99-104` defines the marquee. Row durations at `:31-34` are 41, 48 and 36 seconds. There is no task state or explicit animate action.
- Same issue class: `app/components/store-traffic/OrdersRainAnimation.tsx:145-157` calls `runPass()` on entering the viewport; `RUN_MS` at line 20 is 7,000 ms. `OrdersOnTheWayAnimation.tsx:227-239` does the same with 8,000 ms at line 25. Their active mounts are in `app/routes/app.ai-traffic.tsx:246` and `:265`.
- Trigger: open AI Traffic in normal-motion mode and scroll these cards into view; decorative platform logos slide and currency/order graphics animate. Scrolling away/back can replay them. They neither report processing progress nor acknowledge a relevant merchant task.
- Scope of conclusion: this is a finding about these attention-oriented decorations, not a rule that every entrance transition or one-shot animation is prohibited. BFS has no “one loop is always allowed” exemption. The code already honors reduced-motion; that is not the missing protection.
- Correction: use static illustration for these cards; reserve motion for actual loading/progress or an explicit relevant action. Review related viewport-triggered decorations such as `StatsCards.tsx:576-603` for the same criterion.
- Status: `fail` from code behavior against rejection reason 3; the exact visual prominence should additionally be captured in the authenticated visual audit.

### UI-05 — P2 — Page-detail Back navigates to a previous sibling tab instead of the parent

- Official hard requirement: [BFS 4.1.1, Follow UX best practices](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#411-follow-ux-best-practices), rejection reason 11: a subpage does not offer a back button to the parent page.
- Primary code: `app/routes/app.pages.$id.tsx:149-155` uses `navigate(-1)` whenever history key is not `default`.
- Supporting code: sibling tabs at `:171-181` are regular `Link` navigations and create history entries. The visible Back control at `:185-187` calls that handler.
- Trigger: dashboard → page detail → Diagnosis Detail → Back. The last history entry is Agentic Page Detail, so Back returns to the sibling tab rather than the parent dashboard/list. Page selector changes can create the same problem. A history key being non-default does not identify a logical parent.
- Correction: store the validated entry parent (`/app` or AI Traffic, as appropriate) and preserve it across tabs/page selection, then use that explicit parent destination. Keep browser Back as a separate history operation.
- Status: `fail` from navigation logic. Authenticated browser reproduction is still required for acceptance testing.

### UI-06 — P2 — Actual failures are still styled as amber warnings or neutral text

- Official hard requirement: [BFS 4.2.4, Helpful error messages](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#424-helpful-error-messages), rejection reason 2: an error message appears in a color other than red.
- Supporting official guidance: [Alerts — Error](https://shopify.dev/docs/apps/design/user-experience/alerts#error) defines errors as something not working as expected and explicitly shows red inline errors in lists/forms.
- Strongest primary code: `app/components/blog/BlogWizardForm.tsx:905-909` renders “Couldn't load blog categories ... Refresh ...” in `text-[#8a6116]`. This is a failed API operation, not a low score or advisory warning. The loader sets `blogsError=true` on `fetchBlogs` failure in `app/routes/app.content.blog.$id.tsx:56-64`.
- Same issue in list: `app/components/blog/BlogListSection.tsx:626-629` displays the category-loading error in the same amber text.
- Additional failure surfaces: `app/components/dashboard/StatusBadge.tsx:26-27` and `app/components/blog/BlogStatusBadge.tsx:19-20` map actual `failed` operations to `warning`. Their detailed error explanations go through `HoverTooltip.tsx:141`, which hardcodes neutral `#303030`, including “Network error” / “Something went wrong while generating” returned by `FailureTooltipContent.tsx:43-52`.
- Trigger: failed blog-category load or failed generation/timeout. These branches remain after successful-state fixes elsewhere; shared Tailwind color overrides do not remap `#8a6116` to critical red.
- Correction: use the official critical/error treatment for actual failed operations and persistent actionable error text. Keep genuine caution states (e.g. low scores, pending attention) separate. This finding does not imply every warning or low score should turn red.
- Status: `fail` from explicit error branches and color semantics. Runtime contrast and theme behavior remain unverified.

### UI-07 — P2 — Screenshot preview declares a modal but leaves keyboard focus behind it

- Classification: **official accessibility guidance**, not a separate BFS leaf rejection reason. Relevant broad review area is BFS 4.1.1; its contrast rejection reason is not being repurposed as a keyboard rule.
- Exact official source: [Accessibility — Drawers and modals](https://shopify.dev/docs/apps/build/accessibility#drawers-and-modals): move focus into the modal, keep keyboard navigation inside it, and return focus to the launcher when closing.
- Primary code: `app/routes/app.settings.tsx:520-533` creates a `div role="dialog" aria-modal="true"` with only an image. It has no focus target, focus transfer/trap, inert background, or keyboard-focusable Close button.
- Trigger: select a screenshot, keyboard-activate `Preview screenshot` (`:404-408`). Opening only sets `zoomedUrl`; focus remains on the underlying button. Subsequent Tab can traverse background controls behind the overlay. An Esc listener exists at `:208-216`, so “Esc unsupported” would be incorrect.
- Correction: use an accessible modal with an explicit close action, or implement focus entry, containment, restoration and background inertness for the custom preview. Current official [Modal](https://shopify.dev/docs/api/app-home/latest/web-components/overlays/modal) supports detail/image previews.
- Status: source-confirmed accessibility gap; official-guidance issue. Full screen-reader/keyboard runtime validation remains unverified.

## Merchant-route coverage

All 18 merchant-facing route/layout entry files were inspected, with supporting components and relevant state/action paths traced as listed. This is a source-level route inventory and targeted review, not a claim that every application LOC or every runtime state was executed. Non-UI APIs, worker pipelines, billing mathematics, privacy, and platform integration are handled by the other audit tracks.

| Route file under `app/routes/` | Scope inspected | Result / remaining runtime evidence |
|---|---|---|
| `app.tsx` | Navigation, provider/layout, route guard and unsaved-change integration | No additional static navigation/save-bar defect established; App Bridge/admin highlighting and leave dialog need runtime |
| `app._index.tsx` | Dashboard render, loader review gating, review dismiss action, setup/summary/list composition | UI-01; dashboard viewport-dependent visual states unverified |
| `app.sync.tsx` | Loader/action, timed progress, CTA, completed state and carousel | UI-02; actual install authorization and initial scan need test store |
| `app.ai-traffic.tsx` | Empty/data/zero-order states, charts, cards, feature explanation and mounted animations | UI-03/UI-04; metric meaning and live data independently unverified |
| `app.commission.tsx` | Filters/period/card state, pagination, selected export flow, table and status render, empty/paused states | No additional static UI violation established; financial truth handled by billing track, mobile table interaction needs runtime |
| `app.plan.tsx` | Active/none/inactive states, hosted pricing handoff, explanation/QA and hero composition | No additional confirmed UI finding; sample feature artwork/numeric illustration should be visually checked for clear example context; billing track covers amount/authorization |
| `app.cps-pricing.tsx` | Redirect-only hosted pricing route | No separate UI; approval handoff unverified in test store |
| `app.settings.tsx` | Contact form, persistent errors, attachments, preview and send results | UI-07; keyboard, attachment and successful-send behavior need runtime |
| `app.technical-seo.tsx` | Settings controls, automatic toggles, image optimizer overview/detail handoff and feedback | No additional confirmed static UI defect; live settings/rollback and mobile runtime needed |
| `app.content.blog.tsx` | Blog layout | No additional static issue established |
| `app.content.blog._index.tsx` | Blog listing loader/action integration and composition | UI-06 via BlogListSection; batch actions need test store |
| `app.content.blog.$id.tsx` | Wizard loader/action dispatch and W1-W5 presentation | UI-06; all generation/recovery transitions need test store and workers |
| `app.pages.$id.tsx` | Detail shell, tabs, Back, page selector, observation message | UI-05 |
| `app.pages.$id.detail.tsx` | Agentic page detail, modes/snapshot preview, regenerate states and operation feedback | No additional confirmed static issue; real snapshot loading and regenerated output unverified |
| `app.pages.$id.diagnosis.tsx` | Summary/check rows, error/blocked/processing states, re-diagnose and PDF action | No additional confirmed static issue; PDF contents/worker completion unverified |
| `app.pages.$id.traffic.tsx` | Reachable hidden-tab route; range controls, empty/data states, chart toggles, distribution and FAQ | Shared UI-05 shell; chart/reflow at mobile widths unverified |
| `_index/route.tsx` | Public entry redirect and fallback marketing page | Not the embedded merchant surface; truthfulness of “doesn't modify theme” copy should be reconciled by theme/platform track |
| `auth.login/route.tsx` | Reauthentication fallback form, labels/error mapping, Shopify-origin guidance | No additional static UI issue established; OAuth/runtime handled by platform track |

## Supporting UI areas reviewed

- Shared components: `ui.tsx` (`ControlledModal`), unsaved-change provider/guard, `ActionFeedback`, `AutomationControl`, `HowItWorks`, `ListFilters`, `FaqAccordion`, failure-copy helpers and tooltip behavior.
- Dashboard: `ReviewPromptCard`, `OnboardingGuide`, `TodaysFocus`, `PageListSection`, `StatsCards`, `PipelineWorkflow`, `DateRangePicker`, `TrafficPeriodControl`, `GuidedTour`, `StatusBadge`, `ScoreCell`, `HoverTooltip` / `InfoTooltip`.
- Blog: `BlogListSection`, `BlogWizardForm`, `BlogWizardLayout`, `WizardBackButton`, `W2PickTopic`, `W3TitleOutline`, `W4Generating`, `W5Review`, `PickProductModal`, `EditReferencesModal`, `BlogStatusBadge` and shared confirmation/error behavior.
- Traffic visualizations: `PlatformChips`, `OrdersRainAnimation`, `OrdersOnTheWayAnimation`, `ScanMatrixAnimation`, `CoverageIngestAnimation`; route chart/empty-state usage traced.
- Detail/settings: `HealthGauge`, score buckets, relevant page-selector/diagnosis presentation, `ImageOptimizer` and `ImageOptimizerDetail` main controls/settings/modals/feedback, plan hero runtime and rendered illustration text.
- Styles: shared `tailwind.css` color overrides inspected before making contrast/color claims; plan hero runtime inspected for currently disabled automatic rotation.

## BFS Section 4 ledger guidance for the combined audit

`Unverified` below means no additional static violation was established or the criterion needs runtime/dashboard evidence. It does not mean pass.

| BFS ID | Static result | Evidence / remaining check |
|---|---|---|
| 4.1.1 | fail | UI-05. UI-07 is associated official guidance, not a new rejection subclause. Full visual/admin familiarity and actual contrast need screenshots/computed styles |
| 4.1.2 | unverified | Responsive grids, locally scrollable wide tables and `s-table variant="auto"` found; Shopify mobile/full-page overflow not executed |
| 4.1.3 | unverified | Actual admin app-name truncation depends on deployed name and viewport |
| 4.1.4 | unverified | `s-app-nav` present; parent highlighting and mobile nav need embedded runtime |
| 4.1.5 | unverified | App Bridge SaveBar and leaveConfirmation integration exist for relevant wizard edits; keyboard/browser/native navigation and failure recovery need runtime |
| 4.1.6 | unverified | Shared `s-modal` heading/footer patterns present; no invalid API use established. Modal visual/action behavior needs runtime |
| 4.2.1 | unverified | No new standalone unfamiliar-wording finding beyond UI-02/UI-03; merchant comprehension/reviewer check pending |
| 4.2.2 | fail | UI-02 misleading onboarding completion; full install/onboarding completion pending |
| 4.2.3 | unverified | Homepage includes dynamic metrics/status and dismissible setup; backend truth/extension activation checks belong to platform track |
| 4.2.4 | fail | UI-06 actual errors amber/neutral. Persistent ActionFeedback is otherwise present in many action paths |
| 4.2.5 | unverified | Primary/secondary actions implemented in reviewed flows; final visual hierarchy needs runtime |
| 4.2.6 | unverified | W5 body is editable WYSIWYG with image preview, not a proven missing-preview issue; actual end output must be checked |
| 4.3.1 | fail | UI-03 AI outcome/timeline promises |
| 4.3.2 | unverified | No timed promotion, guilt CTA or rewarded review established in reviewed merchant flows |
| 4.3.3 | fail | UI-04 action-unrelated decorative motion; user-triggered GuidedTour and native review interaction are not auto-modal findings |
| 4.3.4 | unverified | Grouped wizard form and single-result-banner precedence exist; viewport-specific density/banner proximity need runtime |
| 4.3.5 | unverified | Branding needs actual icon/theme screenshots; no independently confirmed impersonation finding |
| 4.3.6 | fail | UI-01 dismissed similar review promotion repeats after 30 days |
| 4.3.7 | unverified | UI/authorization gate coupling and active/inactive pricing state need billing test-store runtime |

## Explicitly ruled-out or deferred allegations

- `shopify.modal.show(id)` with `s-modal` is supported by the current App Bridge Modal API; do not report it as a component-contract violation.
- Do not turn bespoke UI, arbitrary corner radii, or legacy comments into universal BFS failures without an actual cited rejection condition.
- A grep hit for light text is insufficient: `tailwind.css` remaps many legacy text colors to `#616161`; score-ring and score-text colors differ. No contrast failure is claimed without actual foreground/background calculation or runtime evidence.
- SaveBar/unsaved-change handling is present; “no contextual save bar” is not a valid global finding.
- The guided tour is initiated by “Take a tour”; the review native modal is initiated by clicking the review CTA. These are not auto-on-load modal findings.
- The blog batch result only auto-dismisses on full success; failed rows/errors persist. Do not report all batch feedback as auto-disappearing errors.
- Wide commission tables use an inner scroll container; this is not proof that the entire mobile page requires horizontal scrolling.
- Theme-modification claims, backend task enqueue/failure behavior, CPS plan truth, security and protected data are outside this UI subreport's final adjudication and must be reconciled with the other tracks.

## Verification log

- Opened the current official BFS Section 4 snapshot and live official Marketing, Alerts, Onboarding, Accessibility, Modal and App Bridge Modal documentation on 2026-09-16.
- Source audit of the 18 listed route/layout entry files plus targeted supporting UI/state paths; no authenticated Shopify page execution.
- Isolated Node `stripTypeScriptTypes` + VM evaluation of the real `evaluateReviewPrompt` using synthetic fixtures confirmed dismissal resurfacing at 31 days. This was an ad hoc read-only check, not an added app test.
- No app edits, commits, remote writes, outreach, merchant actions, billable actions, or test-store mutations were performed by this track.
