import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 uses `proxy.ts` (the new name for `middleware.ts`) to run code on
 * every request. We use it to keep the Supabase auth session fresh.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     * - _next/static (build output)
     * - _next/image (image optimiser)
     * - favicon.ico
     * - api/webhooks — machine-to-machine endpoints (Paystack). They carry no
     *   session, and refreshing cookies on them would only add latency to a
     *   request that must be acknowledged quickly.
     * - image files (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};