---
name: adding-gtm
description: Add Google Tag Manager (GTM) to a Next.js application, including consent mode, custom events, route-change pageviews, and server-side tagging. Use when the user asks to add GTM, Google Tag Manager, gtag, dataLayer tracking, or tag management to a web application.
---

# Add Google Tag Manager (Next.js)

Use this skill when the user asks to add GTM, Google Tag Manager, gtag, dataLayer tracking, or tag management to a Next.js application.

## 1. Quick start

1. **Detect the router** — App Router (`app/layout.tsx`) vs Pages Router (`pages/_app.tsx`).
2. **Install the official package**:

   ```bash
   npm install @next/third-parties
   ```

3. **Add the container to the root layout** (App Router):

   ```tsx
   import { GoogleTagManager } from "@next/third-parties/google";

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <body>
           <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
           {children}
         </body>
       </html>
     );
   }
   ```

   For Pages Router, add it once in `_app.tsx` instead.

4. **Add the env var** — never hardcode the container ID:

   ```
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   ```

   Add it to `.env.example` too.

## 2. Consent Mode v2 (default-denied gating)

Required since March 2024 for Google Ads / GA4 remarketing, and generally expected for GDPR/POPIA-style compliance. Set consent defaults to `denied` **before** GTM loads, using a `beforeInteractive` script in the root layout `<head>`:

```tsx
<Script id="consent-default" strategy="beforeInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });
  `}
</Script>
```

When the user responds to the cookie-consent banner/CMP, call:

```ts
window.gtag?.("consent", "update", {
  ad_storage: accepted ? "granted" : "denied",
  analytics_storage: accepted ? "granted" : "denied",
  ad_user_data: accepted ? "granted" : "denied",
  ad_personalization: accepted ? "granted" : "denied",
});
```

**Stricter alternative**: for sites that must fully block the GTM script (not just gate the tags inside it), don't mount `<GoogleTagManager>` at all until consent is granted — conditionally render it from consent state instead of relying on Consent Mode signals.

## 3. Sending custom events

Use `sendGTMEvent` from `@next/third-parties/google` for interaction tracking (lead form submits, CTA clicks, etc.). It requires `<GoogleTagManager>` to already be mounted in a parent layout/page:

```tsx
"use client";
import { sendGTMEvent } from "@next/third-parties/google";

function LeadFormButton() {
  return (
    <button onClick={() => sendGTMEvent({ event: "lead_form_submit", form_name: "contact" })}>
      Submit
    </button>
  );
}
```

## 4. Route-change pageviews

Next.js App Router doesn't full-reload on client-side navigation, so GTM's page-view trigger needs help. Either:

- Use GTM's built-in **History Change** trigger (configured in the GTM UI), or
- Push a `page_view` event manually on route change:

```tsx
"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

export function GTMPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    sendGTMEvent({ event: "page_view", page_path: `${pathname}?${searchParams}` });
  }, [pathname, searchParams]);

  return null;
}
```

Mount `<GTMPageView />` once, below `<GoogleTagManager>`, in the root layout.

## 5. Server-side tagging (sGTM)

If the project runs a dedicated server-side tagging server, point the component at it via `gtmScriptUrl` instead of the default `googletagmanager.com/gtm.js`:

```tsx
<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} gtmScriptUrl="https://sgtm.example.com/gtm.js" />
```

Only reach for sGTM when the user needs first-party cookie tagging or wants to bypass ad-blockers/ITP restrictions — it needs its own hosted tagging server and is a separate infra decision from the Next.js integration.

## 6. Multi-environment containers

Don't let staging/dev traffic pollute production GTM data:

- Prefer a separate GTM container ID per environment, set via `NEXT_PUBLIC_GTM_ID` in each environment's env config.
- Or, if sharing one container, use GTM's environment `auth`/`preview` query params (from **Admin → Environments** in the GTM UI) and pass them through `auth`/`preview` props on `<GoogleTagManager>`.

## Notes

- Don't also manually add GA4's `gtag.js` if GA4 is configured as a tag *inside* the GTM container — that double-counts pageviews/events.
- Add `*.googletagmanager.com` to the Content Security Policy if the project has one.
- Verify the setup with GTM's Preview mode / Tag Assistant before publishing a container version.
- Keep `dataLayer` pushes minimal and batched — excessive pushes add runtime overhead.
- Never hardcode container IDs, `auth`, or `preview` tokens — use env vars.
