# LeeWay Private Network Meetings

This lane keeps meetings low-cost and private first.

## Target outcome

- Low cost
- Private network
- No public hosting required at first
- Android phone access to the LeeWay Docker stack
- Private LeeWay meeting links
- Local AI through Ollama
- LeeWay Standards control through the bridge

## Architecture

```text
Android Phone / Laptop
        ↓
Tailscale private network
        ↓
LeeWay Docker machine
        ↓
LeeWay Local Assistant Bridge + Jitsi + Ollama + Media/Voice/Vision lanes
```

## Meeting provider decision

Use **Option A: Jitsi + Tailscale**.

Do **not** add LiveKit yet. LiveKit remains a later premium/deeper-agent lane, but the current build should avoid paid room infrastructure.

## Private meeting URL pattern

```text
https://TAILSCALE-IP:8443/LeeWay-Lead-Or-Campaign-Room
```

Examples:

```text
https://100.x.x.x:8443/LeeWay-Ballers-Club-Barbershop-GO
https://100.x.x.x:8443/LeeWay-AI-Tune-Up-Discovery
```

## LeeWay Standards meeting gate

Every meeting must follow:

1. **Intent** - Why are we meeting?
2. **Context** - Which lead, campaign, offer, and prior notes?
3. **Generation** - Create room link, agenda, invite, and follow-up plan.
4. **Validation** - Confirm date, time, participant, contact info, offer, and meeting type.
5. **Decision** - Leonard approves before sending invitation or changing CRM state.

## CRM meeting fields

Recommended fields to add to the browser CRM:

```json
{
  "meetingProvider": "LeeWay Jitsi",
  "meetingBaseUrl": "https://TAILSCALE-IP:8443",
  "meetingUrl": "https://TAILSCALE-IP:8443/LeeWay-Ballers-Club-Barbershop-GO",
  "meetingDate": "",
  "meetingTime": "",
  "meetingAgenda": "",
  "meetingInvite": "",
  "meetingStatus": "Draft",
  "recordingStatus": "Not started",
  "meetingSummary": "",
  "followUpStatus": "Pending"
}
```

## Bridge endpoints to add next

```text
POST /meeting/create
POST /meeting/invite
POST /meeting/summary
POST /meeting/followup
```

These endpoints should generate meeting links, agendas, summaries, and follow-ups. They should not auto-send email or schedule events without explicit user approval.

## Install layers

Run in order:

```powershell
scripts/04-install-tailscale-and-print-leeway-urls.ps1
scripts/05-install-leeway-jitsi-meet.ps1
scripts/06-test-private-meeting-link.ps1
```

## Notes

Tailscale is ideal for private LeeWay devices. For outside client meetings, either invite the client into Tailscale temporarily or later expose Jitsi through a proper domain/tunnel.
