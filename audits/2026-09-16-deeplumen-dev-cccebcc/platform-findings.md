# Platform, privacy, and integration audit

> Report version: `1.0.2`
> Last modified: `2026-09-16 08:50 UTC`
> Verified: `2026-09-16`
> Reviewer: Codex (OpenAI), platform security subagent
> Target: `deepLumendev/shopify-deeplumen-app`, remote `dev`, commit `cccebcc9c7256a40d68cd6d7cd210761221bdf88`
> Local authorized defensive review environment: `/tmp/shopify-deeplumen-bfs-20260916.4YK5eB/repo`
> Official sources: [BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements), [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements), [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance), [Access tokens](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens), [Metafield ownership](https://shopify.dev/docs/apps/build/metafields#metafield-ownership). Current source contents were read on the verification date. Requirement texts were supplied from the root agent's fresh official downloads; privacy and token pages were independently retrieved live.

Read-only code audit. No app changes, real merchant requests, production requests, external service mutations, or credential output. App test execution is coordinated by the root agent; the observations below are code traces, not claims of a successful production or runtime BFS review.

## Confirmed findings

### PLATFORM-01 — P1 — Theme restoration runs after Shopify has revoked the credentials required to restore it

**Status:** `fail` for the implemented uninstall workflow under its supported canonical-injection configuration. Actual installed-store footprint remains unverified.

**Rule:** BFS **3.2.1**, clean uninstallation; App Store **2.1.2**, functionality without partial errors. [Official access-token revocation contract](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens#refresh-rotation-and-revocation): “A merchant uninstalling your app ... ends all of a token's access. Requests then return `401`.” The BFS **3.2.2** SEO exception means the mere theme-file write is **not** the finding.

**Location:** `apps/shopify-app/app/routes/webhooks.app.uninstalled.tsx:316`–317, same issue at 382–383. `app/lib/canonical-injector.server.ts:1401`, 1424, 1465 are subsequent Admin GraphQL reads/write.

**Reachable trace:**

1. `app/routes/app._index.tsx:163`–194 starts canonical, robots, redirect and llms-template integration after onboarding. Canonical/llms flags default on (`app/lib/feature-flags.server.ts:24`, 39).
2. `app/lib/canonical-injector.server.ts:575`–591 replaces the normal canonical with `/a/shop/...` when the product/collection/article `deeplumen.ap_deployed` boolean is true. `metafield-helpers.server.ts:32`–33 and 92–111 put this in a non-reserved, merchant-owned namespace, not an app-installation field that is the trigger for automatic cleanup.
3. Only after `app/uninstalled` arrives does the handler create an Admin client from the stored session and call `restoreCanonicalInLayoutTheme`. Retaining the local session until later does not retain the already-revoked Shopify permission.
4. A normal post-uninstall `401` prevents theme restoration. The handler records failed stages and terminalizes a degraded receipt (`webhooks.app.uninstalled.tsx:450` onward). It cannot restore the original canonical merely by retrying or retaining the old local token. The llms-template placeholder has the same dependency.

`app/shopify.server.ts:99` explicitly recognizes that the uninstall webhook arrives after access revocation, while `canonical-injector.server.ts:1435` incorrectly calls that same webhook the “only cleanup window.” Current tests mock an available Admin client and restoration helpers (`tests/routes/webhooks-app-uninstalled-recovery.test.ts:129`–163); those mocks cannot prove theme cleanup is possible after uninstall.

**Impact:** Shops with a true deployed metafield can retain canonical links pointing at an app-proxy endpoint that no longer exists, plus injected theme content. This is a supported normal lifecycle path, not a speculative invalid request.

**Correction:** Redesign the storefront integration so uninstall naturally removes or deactivates it without an Admin API call after token revocation. Prefer theme app extensions when they can represent the feature; if the approved SEO exception requires direct edits, prove a platform-supported uninstall-safe fallback before claiming clean uninstall. An optional pre-uninstall restore UI alone cannot cover merchants uninstalling directly from Shopify. Verify a real install → injection/deployment → direct Shopify uninstall → storefront HTML inspection in an approved test store; mock post-uninstall Admin calls returning 401 locally.

### PLATFORM-02 — P1 — Customer data requests are deliberately treated as fulfilled by a count-only audit

**Status:** `fail` in the repository's declared implementation/procedure. An independently evidenced manual fulfillment process could change the finding; none is represented here, and the operative document explicitly says no export is required.

**Rule:** Mandatory Shopify privacy requirement, inherited by BFS **1.1.1**. [Official privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#customers-data_request) says requested customer/order resource data must be provided to the store owner directly. [Response requirements](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#respond-to-compliance-webhooks) require completing the action within **30 days**. Shopify does not require the export to be synchronous or fully automated.

**Location:** `apps/shopify-app/app/lib/compliance-handlers.server.ts:89`–132; specifically only `.count()` at 97–103 and audit data at 120–130. `docs/gdpr-compliance.md:85`–91 calls count/log/200 handling sufficient; its 287–301 Q&A explicitly excludes export.

**Reachable trace:** A valid signed `customers/data_request` with `orders_requested` matching an existing `OrderAttribution` is dispatched by `webhooks.gdpr.tsx`. The handler counts matching rows, logs `ordersFound`/`cpsOrdersFound`, then returns. It neither reads the requested data for delivery nor registers fulfillment ownership/deadline or preserves the request's resource list for a later action. Database count failures are also swallowed. The repository's documented policy says this completes the obligation because no customer-linked data is stored.

That premise is contradicted by the current code. `schema.prisma:2059` onward stores Shopify order ID, order name, monetary values, transaction/refund/payment information and journey metadata. `compliance-handlers.server.ts:83`–85 itself correctly calls these order-linked rows pseudonymised personal data. Current TOMLs request `read_orders`; the Q&A still claims that scope is not requested. Therefore this is more than a missing export button: both the handler and documented fulfillment model discard the requested obligation on a demonstrably retained data class.

**Correction:** Persist a privacy request with the requested resource IDs in an access-controlled store, assign automated or human fulfillment, deliver the retained data securely to the merchant within the official deadline, and record fulfillment evidence. Keep data out of ordinary audit logs; audit should record completion metadata, not the export body. Update the no-data procedure to match the current order/CPS schema. Test a synthetic existing order request through dispatch and fulfillment. Do not relabel an acknowledged webhook as completed export.

**Related documentation drift:** The same document repeatedly states that GDPR deletion is due “within 48 hours.” Shopify sends `shop/redact` **48 hours after uninstall**; the action deadline in the current official page is **30 days after receipt**. A voluntary tighter deletion policy is valid, but it must not be attributed to Shopify as that rule.

### PLATFORM-03 — P2 — Public app landing page promises no theme edits while normal functionality edits theme files

**Status:** `fail` for truthful wording in this branch.

**Rule:** App Store **1.1.4**, factual information. [Official requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements#1-policy). BFS inherits App Store obligations through **1.1.1**; this theme-write statement is not treated as a separate BFS 4.3.1 outcome-promise finding.

**Location:** `apps/shopify-app/app/routes/_index/route.tsx:51`–52: “零主题侵入 … 不修改主题代码、不影响原有 SEO”.

A top-level visit without the `shop` query renders this claim. Actual default-on canonical integration writes theme/snippet files and changes canonical targets, while robots and llms-template modules write theme files as part of the normal onboarding/dashboard path. The SEO exception can authorize implementation; it cannot make the no-edit claim factual.

**Correction:** Describe the actual approved scope of changes, when they occur, and restoration limitations. Remove absolute no-theme-write/no-SEO-impact promises. Confirm the App Store listing uses matching truthful language; listing content was not available in this code audit.

## Conditional findings and unverified evidence

| ID / area | Code evidence | Audit status and missing evidence |
|---|---|---|
| App Store 2.2.4: GraphQL | Main Shopify app and diagnosis worker use GraphQL `ApiVersion.April26`. One reachable operations endpoint calls REST `shop.json`: `apps/admin-dashboard/app/lib/queries/shop-data-a.server.ts:118`, default `2025-01` at 102. | Legacy migration issue; new-public-app eligibility depends on the app creation/distribution date. Do not call this a confirmed merchant BFS failure without that fact. An unsupported API version may fall forward; it is not itself proof of an HTTP failure. The raw stored token path also lacks SDK refresh, so freshness requires runtime evidence. |
| App Store 3.2 / protected customer data | All TOMLs declare the 11 working scopes, plus optional `read_publications`; code has direct consumers for products/content/themes/navigation/orders/files/app proxy. `read_all_orders`, payment mandate, checkout/chat/pixel privileged scopes are absent. | Required purpose mapping has code evidence. Protected-customer-data access approval, deployed SCOPES and minimization decisions need Dashboard/runtime verification. Scope listing is not approval proof. |
| BFS 3.2.2 / App Store 5.1 | Core product is SEO/AI discovery and uses `themeFilesUpsert`; SEO is explicitly a BFS exception. No blanket failure for `write_themes` or missing extension. | Actual Shopify API exemption/approval and approved write scope require Dashboard/reviewer evidence. Root may classify online-store category applicable; exception approval is distinct from clean uninstall. |
| BFS 3.1.5: third-party connection controls | Headless Cloudflare management is in operator dashboard/internal APIs, using one-time state and scoped credentials; merchant `app.*` pages expose no Cloudflare connection/disconnection controls. | Headless functionality is statically allowlisted/special deployment. If offered as part of the publicly reviewed app, merchant control inside Shopify is a gap; distribution/B2B exception and currently exposed product scope require confirmation. Do not label the internal operator UI as the merchant app. |
| App Store 1.1.1 / 2.3.1–4 and BFS 3.1.1–3 | Shopify React Router SDK, managed install, `authenticate.admin`, App Bridge script in `<head>`, official document response headers, `afterAuth` lifecycle hook. A `/auth/login` manual-domain fallback remains but public root has no domain-entry installation form. | Desktop/incognito/mobile install, expired-session recovery and reinstall remain `unverified`; the existence of a template-style dev/fallback route is not proof that the reviewed install flow asks merchants for a domain. |
| Expiring offline tokens | The main Shopify SDK instance sets `future.expiringOfflineAccessTokens: true` at `apps/shopify-app/app/shopify.server.ts:68`–69. Only the separate stateless webhook authenticator sets it to false at 82–83; its session storage methods are all no-ops at 75–80. | Configuration evidence supports expiring offline sessions in the main app. The false flag in an authenticator that does not load or refresh API sessions is not evidence of a non-expiring token flow. Persisted token migration and real refresh behavior remain runtime evidence, under the [official token lifecycle contract](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens). |
| App Store 3.1.1 and security controls | Config URLs use HTTPS; per-route auth and tenant scoping are present; encrypted server storage is deployment-owned. | Live TLS, database/backup encryption, access policy, secret rotation, external firewall and actual production configuration were not inspected. No production security pass claim. |
| Privacy deletion completion | Signed GDPR routes, order tombstones, chunked durable shop deletion, S3/image cleanup queues, headless route revocation before deletion, reinstall lifecycle fencing. | End-to-end DB/S3/search/external route deletion and operational timing need approved integration evidence. CPS financial-retention/legal-exception/minimization is assigned to the billing reviewer and is not adjudicated here. |
| BFS 5.3.1: analytics | Order insights use GraphQL order journeys; bot visits use server request logs and edge response telemetry. `api.blog.track` is authenticated merchant wizard telemetry, not storefront buyer events. `headless-edge-worker/src/worker.ts:340`–377 emits telemetry on server response. | Analytics category is applicable because the app provides performance insights. No injected storefront JavaScript collector was identified. Official wording requires Web Pixels for relevant Shopify events “when needed”; absent extension files alone is not a proven violation. Verify the actual deployed data sources and no omitted client collector. |

## Review coverage and limits

The scope survey enumerated the complete Shopify-app route tree (70 files including support files) and admin-dashboard route tree, then checked loader/action authentication signatures across all route families. Deep traces were read for these areas:

- `app`, homepage, sync, page detail/diagnosis/traffic, AI traffic, settings and blog routes: Shopify admin authentication at loader/action boundaries; selected per-resource mutation/read flows use session-derived shop filters.
- `/api/single-retry`, `/api/batch-retry`: authenticated shop-derived filters for requested IDs and mutations; no cross-shop ID trust found in these paths.
- `/app/api/snapshot-html`, `/app/api/snapshot-image`, `/app/api/image-original`: explicit authentication, tenant ownership filters, bounded presigned URLs, sanitized HTML/sandbox UI.
- `/api/blog/search-products`, `/api/blog/reconcile`, `/api/blog/image/:id`, `/api/blog/track`: authentication/ownership, image type and size guards, no direct trust in client shop domain.
- `/pdf/diagnosis/:id`: signed short-lived export token, page binding, private output/no-referrer/noindex. This intentionally public resource route is not falsely flagged for lacking `authenticate.admin`.
- `/app-proxy` and splat: Shopify SDK HMAC validation, trusted shop extraction, domain validation; generated mirror HTML is sanitized on ingestion. Public headless origin binds verified host to configured credential key and storefront.
- All Shopify webhook route declarations: SDK HMAC authentication (uninstall uses the deliberately stateless authenticator), shared body bounds and in-flight accounting; compliance dispatch and scope/uninstall handlers traced. Webhook signing live delivery is unverified.
- Internal regeneration/backfill routes: fail-closed internal token; scheduler commands gate activation then authenticate; headless internal writes additionally use HMAC/body digest, timestamps, nonce replay checks, scoped key credentials and write feature gates.
- Cloudflare OAuth callback: one-time Redis state, configured expected account/zone scope, grant verification and vault references. Real OAuth connection is unverified.
- Headless telemetry: signed bounded server payload, configured host/key linkage, replay protection and disabled-state handling. Edge production deployment not inspected.
- Admin dashboard: per-leaf UI session guards and bearer-token API guards; production fail-closed credential configuration, signed expiring cookies, same-origin write checks. Public health/404 routes reviewed as intentionally unauthenticated. No assertion that internal shared-account governance is BFS approval evidence.
- Navos adapter: credential-key verification, expiry/revocation/IP checks, authenticated HTTP entry, rate limiting and delegated crawler boundary. SSRF enforcement in the separate CrawStart service is outside this snapshot and remains unverified.
- Webhook/GDPR persistence: `compliance-handlers`, `uninstall-cleanup`, `shop-data-eraser`, headless deletion, image/snapshot queue references, order-attribution schema and operative GDPR documentation.
- Whole-repo production-source searches for REST endpoints, API versions, sensitive scopes, bypass/auth flags, injected browser collection and session storage patterns. No secrets were printed or analyzed by value.

Not every line of every business algorithm was manually read. This is a whole-footprint static platform audit with targeted path review; performance, billing economics, UI/mobile interaction and complete source-file inventory are coordinated by the other reviewers/root agent. It does not replace the required real Shopify review and Dashboard evidence.
