<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Airtable writes

Use the `airtable` npm SDK — never raw `fetch` to the REST API. The admin
repo (`app/api/interview/route.ts`) is the reference pattern:

```ts
import Airtable from "airtable";
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(BASE_ID);
const rec = await base("TableName").create(fields, { typecast: true });
await base("OtherTable").update(otherId, { LinkField: [rec.id] });
```

- Linked-record fields: plain `["recXXX"]` arrays of ID strings. The SDK
  handles serialization.
- `typecast: true` goes as an SDK option on `create`/`update`, not inside
  the body. Use it on writes that touch select-fields where new options
  may be needed.
- Raw `fetch` with `typecast: true` and `[{id: "rec..."}]` link payloads
  silently drops the link field — that's the bug that broke
  Elev↔Vårdnadshavare-länkning before this convention was adopted (see PR #78).

