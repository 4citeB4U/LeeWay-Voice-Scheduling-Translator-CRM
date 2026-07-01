# LeeWay Meeting Controller Plan

This plan fixes the gap between a raw Jitsi room link and a real meeting product experience like Google Meet, GoToMeeting, or Zoom.

## Current problem

A raw Jitsi link is only a room URL. It does not automatically provide the full meeting control layer that users expect from Google Meet or GoToMeeting.

A raw link may fail or feel incomplete when:

- the participant is not on the same private network
- Tailscale Serve/Funnel is not enabled
- HTTPS is not trusted
- the room is only local/private
- there is no CRM meeting record
- there is no calendar invite
- there is no host control panel
- there is no reminder workflow
- there is no scheduled meeting state
- there is no participant tracking
- there is no Agent Lee pre-meeting/post-meeting workflow

## Decision

Build a LeeWay Meeting Controller layer.

Jitsi provides the video room.

LeeWay Meeting Controller provides:

- meeting records
- schedule state
- invite generation
- link mode selection
- participant list
- approval gate
- reminders
- host controls
- notes
- recording/transcript/translation workflow
- Seafile storage receipts
- Agent Lee dispatcher support

## Required meeting modes

### Private Test Mode

For Leonard's devices only.

```text
http://100.80.10.39:8008/LeeWay-Test-Room
```

Requires phone/laptop access through local network or Tailscale.

### Private Trusted Mode

For internal LeeWay devices using Tailscale Serve.

```text
https://agent-lee.tailnet.ts.net/LeeWay-Test-Room
```

Requires Tailscale Serve enabled.

### Client Meeting Mode

For outside clients who should not have to install Tailscale or Jitsi.

Requires public HTTPS path through Tailscale Funnel, Cloudflare Tunnel, or proper domain.

Example future link:

```text
https://meet.leewayindustries.com/LeeWay-Marcus-Ballers-Club-AI-Tune-Up-A7K9
```

## Important truth

Jitsi does not require the participant to download Jitsi.

But if the link is private to Tailscale, the participant needs access to that private network.

For a client-friendly link like Google Meet, use Client Meeting Mode with public HTTPS.

## Meeting room naming

Do not use raw phone numbers as public room names.

Preferred format:

```text
LeeWay-{ParticipantName}-{BusinessName}-{MeetingType}-{ShortNonce}
```

Example:

```text
LeeWay-Marcus-Ballers-Club-AI-Tune-Up-A7K9
```

For test numbers, store the phone number in the meeting record, but avoid exposing it in the URL unless it is private-only test mode.

## Meeting schema

```json
{
  "id": "",
  "leadId": "",
  "participantName": "",
  "participantPhone": "",
  "participantEmail": "",
  "businessName": "",
  "meetingType": "AI Tune-Up",
  "mode": "Private Test|Private Trusted|Client Public",
  "provider": "LeeWay Jitsi",
  "baseUrl": "",
  "roomSlug": "",
  "meetingUrl": "",
  "date": "",
  "time": "",
  "timezone": "America/Chicago",
  "status": "Draft|Scheduled|Sent|Joined|Completed|Missed|Reschedule Needed|Canceled",
  "hostControls": {
    "lobbyEnabled": false,
    "passwordEnabled": false,
    "recordingEnabled": false,
    "transcriptionEnabled": false,
    "translationEnabled": false
  },
  "agenda": "",
  "inviteMessage": "",
  "approvalStatus": "Pending",
  "createdAt": "",
  "updatedAt": ""
}
```

## CRM UI requirements

Add a Meetings tab with:

- Create Meeting
- Select Lead
- Participant Name
- Participant Phone
- Participant Email
- Meeting Type
- Date
- Time
- Meeting Mode
- Generate Link
- Copy Invite
- Open Host Room
- Save to Seafile
- Mark Sent
- Mark Completed
- Generate Follow-Up

## Meeting controller states

```text
Draft
Scheduled
Invite Copied
Invite Sent Manually
Joined
Completed
Missed
Reschedule Needed
Canceled
```

## Required bridge endpoints

```text
POST /meeting/create
GET  /meeting/:id
POST /meeting/:id/invite
POST /meeting/:id/mark-sent
POST /meeting/:id/notes
POST /meeting/:id/summary
POST /meeting/:id/followup
POST /meeting/:id/receipt
```

## Security requirements

Read and enforce:

```text
security/leeway-crm-security-gate.md
features/leeway-seafile-system-of-record.md
```

Protected actions require approval:

- generating a public client link
- copying/sending invite
- starting recording
- starting transcription
- starting translation
- saving location check-in
- saving meeting recording/transcript
- sending follow-up

## Storage requirements

Seafile is the durable source of truth.

Meeting records should be stored under:

```text
LeeWay CRM Vault/02_Meetings/
  invites/
  notes/
  recordings/
  transcripts/
  translations/
  summaries/
```

localStorage only caches the latest meeting draft and sync queue.

## Test flow

For test phone 414-303-8480:

1. Create meeting record.
2. Set participantPhone to `414-303-8480`.
3. Set mode to `Private Test` only if that phone can reach Tailscale/local network.
4. Generate private test URL.
5. If participant cannot open the link, switch to Client Meeting Mode and use public HTTPS tunnel/domain.

## Definition of done

A LeeWay meeting is not complete until:

- the CRM stores a meeting record
- the link has a valid accessible base URL
- the invite clearly states private or public mode
- participant does not need to download Jitsi
- outside clients can join without Tailscale only in Client Meeting Mode
- Agent Lee can generate agenda/follow-up drafts
- protected actions are approval-gated
- meeting data is saved to Seafile with receipts
