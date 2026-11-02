# LeeWay ERP & CRM integration contract

> STATUS: DEVELOPMENT — not a production acceptance receipt.

## 5WH identity
- REGION: LEEWAY_CRM_INTEGRATION
- TAG: LEEWAY-CRM-INTEGRATION-001
- WHAT: Integration boundary between the existing field outreach CRM and uploaded LeeWay ERP & CRM standalone UI.
- WHY: Consolidate useful field features without duplicating customer authority or claiming unverified live services.
- WHO: LeeWay Industries / authorized maintainers.
- WHERE: `docs/erp-crm-integration.md` in the CRM integration branch.
- WHEN: 2026-11-02.
- HOW: Stage a reviewed customer schema, feature adapters, and a governed Runtime contract before moving the production entrypoint.
- LICENSE: Subject to verified repository license and LeeWay authored-source standards.

## Scope and canonical identity
The uploaded **LeeWay ERP & CRM standalone HTML** is the intended commercial/ERP foundation. The existing GitHub Pages outreach CRM contributes **Today's Route, Regional Scheduler, Translator, Voice Capture, Scripts, Campaigns, Import/Export, and Activity Log**. The final entrypoint belongs at this repository's GitHub Pages URL. No Agent Tablet work is authorized before owner acceptance.

The uploaded HTML includes commercial pipeline, BOM, manufacturing orders, warehousing/dispatch, device bridge UI, integration gateway, and infrastructure UI. Inclusion in standalone HTML does **not** prove any server, device, Veritas, receipt, or database is connected.

## Non-destructive migration rules
1. Preserve the source CRM localStorage data (`leewayCRM`, `leewayCRMActivities`, `leewayCRMRegions`, `leewayCRMRoutes`) until export, schema validation, mapping, import verification, and owner acceptance.
2. Import contacts/leads as provisional records with stable source IDs. Do not silently overwrite commercial opportunities or count duplicate leads as new accounts.
3. Separate organization, contact, lead, opportunity, appointment, region, route, route stop, activity, script, campaign, translation note and voice transcript.
4. Preserve source provenance and timestamps. Use explicit stage mapping; do not conflate outreach stages with manufacturing/fulfillment stages.
5. Validate imported CSV/JSON before mutation. Preview duplicate decisions and counts; supply rollback/export.
6. Client-side storage is a development cache, not a multi-agent source of truth.
7. Never claim Veritas PASS, receipt, live hardware, production revenue, or synchronized CRM without authenticated runtime evidence.

## Capability boundaries
| Module | First implementation constraint |
| --- | --- |
| Today's Route | Manual stops and distances remain distinct from verified route services. |
| Regional Scheduler | Preserve user-configurable radius, week, mileage, fuel model and appointment linking. |
| Translator | Existing Spanish phrase pairs only. No Google translation. Unavailable languages return unavailable. |
| Voice Capture | Existing browser recognition remains explicitly a browser fallback; canonical LeeWay Voice Fabric binding is unverified. |
| Scripts | Preserve approved templates; never send outreach automatically. |
| Campaigns | Compose drafts; require recipient selection and explicit sending authorization. |
| Import / Export | Preserve lossless JSON compatibility, escaped CSV and import preview. |
| Activity Log | Link each event to source identity, account, user, date, type and action status. |
| ERP | Preserve existing BOM, MO, inventory, dispatch and sales pipeline concepts without pretending sample data are live. |

## First verified engineering gate
1. Retrieve and hash the canonical ERP & CRM source bytes in a runtime accessible to the build/test harness.
2. Inventory existing repo assets, licenses, dependencies, scripts and storage keys.
3. Create a migration fixture and prove lead/contact/opportunity/activity mapping without changing live records.
4. Move selected modules into the ERP & CRM UI with working navigation and persistent state.
5. Run parse, browser interaction, import/export roundtrip, compatibility, security and accessibility checks.
6. Publish to a reviewable GitHub Pages preview or approved target, obtain owner approval, then promote to main.
7. Agent Tablet connection is a separate later gate, explicitly not in scope.

## Evidence
- Source outreach `index.html` and `README.md` inspected via GitHub.
- Uploaded standalone ERP/CRM content inspected in conversation, but not yet available as bytes to this GitHub editing tool.
- Production runtime connectivity and integration tests: NOT RUN.
- RECEIPT NOT CREATED; LEARNING LEDGER NOT UPDATED.
