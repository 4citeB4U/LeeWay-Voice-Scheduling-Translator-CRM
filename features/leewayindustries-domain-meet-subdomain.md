# LeeWay Industries Domain and Meeting Subdomain Plan

## Decision

Use this public client meeting hostname:

```text
meet.leewayindustries.com
```

This should route only to the LeeWay Jitsi meeting web surface.

Do not expose the LeeWay bridge, Ollama, Seafile, runtime fabric, agent centers, voice kernel, or vision kernel publicly.

## Current working public fallback

Tailscale Funnel is currently working at:

```text
https://agent-lee.tail4baa5f.ts.net/
```

This can be used as the fallback public meeting URL while the custom domain is being configured.

## Production target

```text
https://meet.leewayindustries.com/LeeWay-{ParticipantName}-{BusinessName}-{MeetingType}-{ShortNonce}
```

Example:

```text
https://meet.leewayindustries.com/LeeWay-Marcus-Ballers-Club-AI-Tune-Up-A7K9
```

## Recommended implementation

Use Cloudflare DNS and Cloudflare Tunnel for the custom domain.

Routing:

```text
meet.leewayindustries.com
    -> Cloudflare Tunnel
    -> http://127.0.0.1:8008
    -> LeeWay Jitsi web container
```

## Why not only Tailscale Funnel

Tailscale Funnel is useful and already working, but it exposes a `ts.net` hostname.

For a branded client link that stays as `meet.leewayindustries.com`, use Cloudflare Tunnel or an equivalent reverse proxy.

## Security rule

Only route this service publicly:

```text
Jitsi web: http://127.0.0.1:8008
```

Never route these publicly:

```text
LeeWay bridge: 8787
Ollama: 11434
Seafile admin
Runtime fabric: 4001
Hybrid fabric: 8777
Agent centers: 8860-8863
Voice kernel: 8092
Vision kernel: 8093
Docker admin ports
```

## CRM settings after domain is live

```json
{
  "meetingProvider": "LeeWay Jitsi",
  "privateTestBaseUrl": "http://100.80.10.39:8008",
  "funnelBaseUrl": "https://agent-lee.tail4baa5f.ts.net",
  "clientPublicBaseUrl": "https://meet.leewayindustries.com",
  "bridgeUrl": "http://100.80.10.39:8787"
}
```

## Build sequence

1. Register or confirm control of `leewayindustries.com`.
2. Add the domain to Cloudflare DNS.
3. Create a Cloudflare Tunnel named `leeway-meet`.
4. Install/run `cloudflared` on the LeeWay laptop or Docker host.
5. Add a public hostname route:
   - hostname: `meet.leewayindustries.com`
   - service: `http://127.0.0.1:8008`
6. Test `https://meet.leewayindustries.com`.
7. Update CRM `Client Meeting Mode` to use `https://meet.leewayindustries.com`.
8. Keep Tailscale Funnel as backup.

## Definition of done

- `https://meet.leewayindustries.com` opens the LeeWay Jitsi join page.
- Client meeting links do not require Jitsi download.
- Client meeting links do not require Tailscale download.
- Only Jitsi web is public.
- Bridge/Ollama/Seafile remain private.
- CRM can generate branded meeting URLs using the new base URL.
