"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  client: string;
  slot: string;
  format?: "auto" | "autorelaxed";
}

export function AdSlot({ client, slot, format = "auto" }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || !slot || pushed.current) return;
    const win = window as Window & { adsbygoogle?: unknown[] };
    win.adsbygoogle = win.adsbygoogle || [];
    try {
      win.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      pushed.current = false;
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <aside className="blog-ad" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={format === "auto" ? "true" : undefined}
      />
    </aside>
  );
}
