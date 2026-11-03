# LeeWay CRM/ERP Co-Existence — Governed Connector Acceptance Contract

> STATE: PROPOSED. No live vendor connection, bidirectional mirroring, Veritas production receipt, or owner acceptance is claimed.

## 5WH identity
- REGION: LEEWAY_CRM_COEXISTENCE
- TAG: LEEWAY-CRM-COEXIST-001
- WHAT: Consent- and tenant-governed synchronization between LeeWay's canonical CRM/ERP and incumbent customer providers.
- WHY: Enable adoption without forcing migration or interrupting existing vendor relationships.
- WHO: Authorized tenant administrators, customer users, governed LeeWay Runtime and Veritas.
- WHERE: Canonical CRM/ERP service boundary, not GitHub Pages browser-only code.
- WHEN: 2026-11-02
- HOW: OAuth adapters + schema introspection + durable event inbox/outbox + mapping + conflict decisions + receipts.
- LICENSE: Apache-2.0 (verify repository license status before promotion).

## Existing boundaries
- Production `index.html` is static GitHub Pages HTML with local in-memory example data; it has no proven CRM provider authentication, database, tenant boundary, or server webhook handler.
- `renderGateways()` hardcodes connected/active provider statuses and event counts; `simulateInboundCrm()` adds a synthetic opportunity.
- `addVeritas()` uses Math.random in a value labeled sha256. These are NOT authoritative production receipts.
- The three engagement modules work on browser-local storage only. Voice audio is stored in IndexedDB. A text record reference is not a synced CRM attachment.
- Keep existing customer browser keys `leewayCRM`, `leewayCRMActivities`, `leewayCRMRegions`, `leewayCRMRoutes` unchanged; never auto-migrate or overwrite.

## Canonical runtime capability contract
1. **Connect:** tenant-specific OAuth authorization code + PKCE where supported; secure server-side token vault; scoped read-only authorization first; never store tokens in browser localStorage.
2. **Discover:** provider adapter fetches actual account, object, board and custom-field metadata. Map provider IDs to stable LeeWay entity/field IDs; preserve unmapped fields in namespaced raw provenance. No default field guessed from label alone.
3. **Initial import:** paginated checkpointed read with tenant scoping; stable source ID, cursor, provider revision/etag, observed timestamp, origin and rights. Produce read-only review/duplicate report before materialization.
4. **Inbound events:** verify provider signing or challenge response; persist inbox before ack; idempotency key, deduplication, replay window, retry/backoff, poison event queue.
5. **Outbound events:** append typed, authorized change to transactional outbox after Veritas pre-gate; require approved field scope; use provider native API and observed version/etag; emit acknowledgment only on successful provider response.
6. **Conflict policy:** compare provider revisions and per-field ownership rules first; do NOT blindly apply last-write-wins from unsynchronized wall clocks. Concurrent conflicts must be held for review. Immutable change provenance and conflict decision history.
7. **Governance:** existing Runtime Fabric ingress, Veritas pre/post gates, receipt authority and Learning Ledger; no parallel runtime or invented cryptographic proof.
8. **Disconnect:** revoke credentials where supported; stop all polling/webhooks; preserve existing vendor account and customer data; honor retention settings.

## Provider scope
- Monday.com: board/item/column metadata, item change webhooks, custom fields and board write-back.
- Salesforce: objects, field metadata, change events or polling fallback, scoped REST writes.
- HubSpot: CRM object schemas, webhooks and scoped APIs.
- Dynamics 365: Dataverse metadata and authenticated change tracking.
- Custom ERP: explicit adapter contract with schema version and tenant capabilities.
- Each provider must independently pass connection, mapping, inbound, outbound, retry, conflict, authorization, disconnect and rollback tests.

## Acceptance gates
- **Gate A — UI:** original seven ERP sections intact; new sidebar and panes load; navigation, local route and campaign saves, recording consent, IndexedDB export and previous UI actions tested.
- **Gate B — connection:** real owner-bound provider OAuth, schema introspection, revoked-token failure and tenant isolation.
- **Gate C — live governed path:** one real authorized provider record change -> verified inbound event -> normalized local read model -> approved outbound change -> provider acknowledgment -> Veritas post-gate -> inspectable receipt -> Learning Ledger.
- **Gate D — operational:** resilient resync, webhook outage, duplicate and ordering faults, field conflict, deletion, export/rollback and provider disconnect.
- **Gate E — release:** preview review, security review, owner acceptance, then deploy/promotion.

No recipient campaign execution or recorded audio upload until explicit approval and relevant legal/privacy controls are verified.
