# Ideas & Integrations

## Meta CAPI

### Lead-event ✅ Klar
Skickas server-side via Conversions API när ett formulär skickas in (jobbansökan, elevanmälan). Matchar pixel-eventet med `event_id` för deduplicering.

### QualifyLead-event 🅿️ Parkerad
Endpoint byggd: `POST /api/meta-crm-event`

Skickar ett `QualifyLead`-event till Meta när en jobbansökan får status **"Anställ"** i Airtable. Gör det möjligt att byta kampanjmål till "Maximera antalet konverteringsleads" vilket enligt Meta ger ~9,5% lägre kostnad per kvalitetslead.

**Återstår:**
- Sätt upp Airtable-automation (trigger: Status = Anställ, action: Run script → anropar endpointen)
- Samla ~50 QualifyLead-events
- Skapa ny Facebook-kampanj med optimeringsmål "Maximera konverteringsleads"

**Env vars:**
- `AIRTABLE_FACEBOOK_WEBHOOK_SECRET` — Sensitive, skyddar endpointen
- `META_ACCESS_TOKEN` — redan i bruk
