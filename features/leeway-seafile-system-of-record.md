# LeeWay Seafile System of Record Plan

This plan corrects the CRM data architecture. Browser localStorage must be treated only as an offline/cache layer. Seafile should become the private LeeWay system of record for CRM exports, meeting notes, recordings, transcripts, translation files, dispatcher receipts, and protected-action evidence.

## Decision

Use Seafile as the LeeWay private file/data vault.

Use localStorage only for:

- temporary offline draft state
- page responsiveness
- emergency fallback when Seafile is unreachable
- cached settings and last-opened lead

Do not treat localStorage as the permanent CRM database.

## Why localStorage was used first

The first CRM version was GitHub Pages compatible and backend-free. localStorage made the page work immediately without a server, login layer, or database.

That is acceptable for prototype/offline mode, but it is not sufficient for the full LeeWay operator system.

## Why Seafile is better for LeeWay

Seafile should hold durable CRM artifacts because it supports a private self-hosted file vault pattern and can sync files across devices through the LeeWay infrastructure.

Seafile should store:

- CRM master JSON snapshots
- lead files
- meeting notes
- meeting invites
- call-back reminders
- dispatcher plans
- location receipts
- uploaded documents
- audio/video meeting recordings
- transcripts
- translations
- proof receipts
- exported reports

## High-level architecture

```text
GitHub Pages CRM UI
    ↓
Local browser cache
    ↓
LeeWay Local Assistant Bridge
    ↓
Seafile private vault
    ↓
LeeWay Docker storage / backup / sync
```

## Required Seafile bridge endpoints

Add these endpoints to the LeeWay bridge or a dedicated Seafile adapter service:

```text
GET  /seafile/status
GET  /seafile/libraries
POST /seafile/crm/save-snapshot
GET  /seafile/crm/latest-snapshot
POST /seafile/lead/save
GET  /seafile/lead/:leadId
POST /seafile/meeting/save
POST /seafile/meeting/upload-recording
POST /seafile/transcript/save
POST /seafile/translation/save
POST /seafile/receipt/save
POST /seafile/export/save
```

## Suggested Seafile library structure

```text
LeeWay CRM Vault/
  00_System/
    settings/
    schemas/
    receipts/
    audit/
  01_CRM/
    snapshots/
    leads/
    activities/
    reminders/
    dispatch/
  02_Meetings/
    invites/
    notes/
    recordings/
    transcripts/
    translations/
    summaries/
  03_Clients/
    {client-or-business-name}/
      profile.json
      notes/
      meetings/
      documents/
      receipts/
  04_Routes_Location/
    checkins/
    maps/
    route-plans/
  05_Exports/
    json/
    csv/
    reports/
```

## CRM data flow

### Load flow

1. CRM starts.
2. CRM loads last localStorage cache for speed.
3. CRM calls bridge `/seafile/status`.
4. If Seafile is reachable, CRM loads latest snapshot from Seafile.
5. CRM merges or asks user before overwriting local changes.
6. CRM shows sync state: `Seafile Connected`, `Offline Cache`, or `Sync Conflict`.

### Save flow

1. User changes a lead, meeting, note, or reminder.
2. CRM saves draft to localStorage immediately.
3. CRM queues a Seafile sync job.
4. Bridge writes durable file to Seafile.
5. Bridge returns receipt.
6. CRM stores receipt in local activity log.

## Security requirements

Read and enforce:

```text
security/leeway-crm-security-gate.md
```

Rules:

- Never store Seafile username/password in browser localStorage.
- Never commit Seafile credentials to GitHub.
- Bridge reads Seafile credentials only from local `.env` or secure local secret store.
- CRM talks to Seafile through the local LeeWay bridge, not directly from GitHub Pages with secrets.
- Protected exports require approval.
- Recording/transcript uploads require approval.
- Location receipt saves require approval.
- LLM access to Seafile documents must be task-scoped and approval-gated.

## LocalStorage policy after Seafile integration

Allowed localStorage keys:

```text
leewayCRMCache
leewayCRMSettingsCache
leewayCRMSyncQueue
leewayCRMLastOpenLead
leewayCRMLastSyncReceipt
```

Legacy keys may remain during migration, but the long-term source of truth must be Seafile.

## Conflict handling

If both localStorage and Seafile changed:

- show a conflict banner
- compare timestamps
- allow user to keep local, keep Seafile, or merge
- write a conflict receipt

## Agent Lee behavior with Seafile

Agent Lee can help retrieve, summarize, and organize Seafile-backed CRM files, but must not freely read the entire vault.

Agent Lee should require:

- selected lead
- selected meeting
- selected document
- selected task
- approval for broad search or export

## Build sequence

1. Add Seafile settings panel to CRM.
2. Add bridge Seafile adapter.
3. Add `/seafile/status` health check.
4. Add save/load CRM snapshot endpoints.
5. Add meeting/lead/reminder save endpoints.
6. Add receipt logging.
7. Add sync status badge in CRM.
8. Add migration button: `Migrate localStorage CRM to Seafile`.
9. Add conflict detection.
10. Add recording/transcript storage after manual notes are stable.

## Definition of done

The CRM is not fully LeeWay-ready until:

- Seafile is the durable source of truth.
- localStorage is only cache/offline fallback.
- Every protected file write creates a receipt.
- No Seafile credentials exist in GitHub or browser storage.
- CRM can export/import snapshots through Seafile.
- Meetings, recordings, transcripts, translations, reminders, dispatch plans, and location receipts can be stored in Seafile.
