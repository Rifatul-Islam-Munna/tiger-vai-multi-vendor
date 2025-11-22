"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageViewEvent } from "@/lib/google-tag-manager";
import { v4 as uuidv4 } from "uuid";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    pageViewEvent({
      event_id: uuidv4(), // or use your own ID generator
      url: url,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
