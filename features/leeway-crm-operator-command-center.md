# LeeWay CRM Operator Command Center Feature Plan

This file defines the visible CRM feature layer that still needs to be built into `index.html` and the local LeeWay bridge. The existing scripts added the laptop/private-network infrastructure. This plan turns that infrastructure into user-facing CRM tools.

## Current truth

The repo currently has infrastructure support for:

- Local LeeWay bridge scripts
- Tailscale private URL setup
- Private Jitsi Docker install/test scripts
- Private meeting architecture documentation

The public CRM page still needs visible UI features for video conferencing, sending meeting links, scheduling, forms, reminders, dispatching, mapping, translation, recording notes, and follow-up workflows.

## Target product

Build a single-page LeeWay CRM Operator Command Center that helps Leonard run outreach, meetings, follow-ups, and field planning from one browser page.

## New CRM modules to add

### 1. Meetings Command Center

Add a new tab named `Meetings`.

Features:

- Generate LeeWay-branded Jitsi meeting links
- Link format starts with `LeeWay`
- Automatically include participant/contact name
- Automatically include business/organization name
- Optionally include meeting type such as `AI-Tune-Up`, `Discovery`, `Follow-Up`, or `Planning`
- Copy meeting invite
- Open meeting room
- Save meeting record to localStorage
- Link meeting to lead record
- Track meeting status: Draft, Sent, Scheduled, Completed, Missed, Reschedule Needed

Meeting URL pattern:

```text
{meetingBaseUrl}/LeeWay-{ParticipantName}-{BusinessName}-{MeetingType}
```

Example:

```text
https://agent-lee.tailnet.ts.net/LeeWay-Marcus-Ballers-Club-AI-Tune-Up
```

Local/private fallback:

```text
http://100.80.10.39:8008/LeeWay-Marcus-Ballers-Club-AI-Tune-Up
```

### 2. Agent Lee Form Assistant

Add an `Agent Lee Assist` panel that can help fill out lead, meeting, callback, and follow-up forms.

Features:

- Read current lead form values
- Suggest missing fields
- Generate cleaned summaries
- Generate pain points
- Generate next action
- Generate call script
- Generate email draft
- Generate SMS draft
- Generate meeting agenda
- Never auto-send without approval

Bridge endpoint target:

```text
POST /assistant
```

Prompt mode examples:

- `lead_cleanup`
- `meeting_agenda`
- `followup_email`
- `sms_invite`
- `dispatcher_plan`
- `route_plan`
- `translation_summary`

### 3. Scheduling and Callback Alerts

Add callback/reminder support.

Features:

- Follow-up date
- Follow-up time
- Reminder type: Call, Text, Email, Visit, Meeting
- Alert priority: Normal, Hot, Urgent
- Browser notification support where available
- Daily callback queue
- Overdue callback list
- Today route list integration

LocalStorage key:

```text
leewayCRMReminders
```

Reminder schema:

```json
{
  "id": "",
  "leadId": "",
  "title": "Call Marcus at Ballers Club",
  "type": "Call",
  "dueDate": "",
  "dueTime": "",
  "status": "Pending",
  "priority": "Hot",
  "notes": "Confirm 20-minute AI Tune-Up meeting.",
  "createdAt": "",
  "updatedAt": ""
}
```

### 4. Email and SMS Follow-Up Drafting

Add a `Follow-Up` panel.

Features:

- Generate email draft
- Generate SMS draft
- Generate meeting invite message
- Copy to clipboard
- Mark sent manually
- Save outbound communication activity
- Do not send automatically unless an approved email/SMS connector exists

Signature block:

```text
Leonard Lee
LeeWay Industries | LeeWay Innovations
Milwaukee, WI 53205
Phone: 414-303-8580
Fax: 414-239-8531
Email: leonardlee6@outlook.com
Resume: https://4citeb4u.github.io/Leonard-Lee-Resume/
GitHub: https://github.com/4citeB4U
```

Important: Leonard's phone/fax/email belong only in outbound signatures. They must not overwrite a lead's contact fields.

### 5. Meeting Notes, Recording, Translation, and Summary

Add a `Meeting Notes` panel.

Phase 1 browser-only:

- Manual meeting notes
- Paste transcript
- Generate summary through local bridge
- Generate action items
- Generate follow-up email/SMS
- Save summary to activity log

Phase 2 media lane:

- Route uploaded audio/video to LeeWay media ingestion layer
- Prepare transcription job
- Translate summary
- Store receipt
- Keep proof of source, date, participant, and meeting link

Possible bridge endpoints later:

```text
POST /meeting/summary
POST /meeting/followup
POST /media/transcribe
POST /media/translate
```

### 6. Dispatcher Planning

Add a `Dispatcher` tab or panel.

Features:

- Today's calls
- Today's meetings
- Today's visits
- Hot leads
- Overdue follow-ups
- Route planning by city/region
- Suggested next best action
- Dispatch script for each stop/call
- Mark complete, no answer, reschedule, or follow-up needed

### 7. Mapping and Location Tracking

Add a `Map/Route` panel.

Phase 1:

- Store lead address
- Generate Google Maps link
- Generate Apple Maps link
- Generate route list
- Open selected address in maps

Phase 2:

- Browser geolocation check-in
- Optional user-approved location capture
- Distance sorting
- Route optimization
- Visit receipts

Safety rule:

- Do not track location silently.
- User must explicitly press `Check In` or `Use My Location`.

Map link pattern:

```text
https://www.google.com/maps/search/?api=1&query={encodedAddress}
```

### 8. LeeWay Standards Gate

Every protected action must show a gate before writing state or sending anything.

Gate fields:

```json
{
  "intent": "",
  "context": "",
  "generation": "",
  "validation": "",
  "decision": "Pending Approval"
}
```

Protected actions:

- Send email
- Send SMS
- Schedule meeting
- Mark lead as contacted
- Mark meeting complete
- Save location check-in
- Generate external public link
- Upload audio/video for transcription

## LocalStorage additions

```text
leewayCRMMeetings
leewayCRMReminders
leewayCRMDispatch
leewayCRMSettings
leewayCRMMeetingNotes
leewayCRMLocationReceipts
```

## CRM Settings to add

```json
{
  "bridgeUrl": "http://100.80.10.39:8787",
  "meetingProvider": "LeeWay Jitsi",
  "meetingBaseUrl": "http://100.80.10.39:8008",
  "trustedMeetingBaseUrl": "https://agent-lee.tailnet.ts.net",
  "defaultModel": "qwen3:latest",
  "visionModel": "qwen2.5vl:7b",
  "timezone": "America/Chicago"
}
```

## Build sequence

1. Add CRM Settings panel for bridge URL and meeting base URL.
2. Add Meetings tab with LeeWay branded link generator.
3. Add Follow-Up panel with copyable email/SMS/message drafts.
4. Add Reminder/Callback queue with due date and due time.
5. Add Agent Lee Assist panel calling `/assistant`.
6. Add Meeting Notes and Summary panel.
7. Add Dispatcher tab.
8. Add map links and route planning.
9. Add optional browser notifications.
10. Add media/transcription/translation integration after the manual notes flow works.

## Definition of done

The GitHub Pages CRM should visibly show:

- Meetings tab
- Generate LeeWay meeting link button
- Copy invite button
- Open meeting button
- Callback reminder fields
- Today's callback queue
- Follow-up email/SMS drafts
- Agent Lee Assist button
- Dispatcher route/call planning panel
- Map links for lead addresses
- Meeting notes and summary panel

The local bridge should support Agent Lee drafting and summarizing. The CRM must remain usable without the bridge by falling back to manual copy/export workflows.
