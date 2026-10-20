
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";

const IDLE_TIMEOUT = 30 * 60 * 1000;
const LAST_ACTIVITY_KEY = "magangku-admin-last-activity";

export default function AdminIdleLogout() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let active = true;

    const supabase = createClient();

    const logout = async () => {
      if (!active) return;

      active = false;
      clearTimeout(timeoutId);

      localStorage.removeItem(LAST_ACTIVITY_KEY);
      await supabase.auth.signOut();

      window.location.replace("/admin/login?reason=idle");
    };

    const resetTimer = () => {
      if (!active) return;

      const now = Date.now();
      const lastActivity = Number(
        localStorage.getItem(LAST_ACTIVITY_KEY)
      );

      // Jika aktivitas terakhir sudah lebih dari 30 menit,
      // akhiri sesi admin.
      if (
        lastActivity &&
        now - lastActivity >= IDLE_TIMEOUT
      ) {
        void logout();
        return;
      }

      localStorage.setItem(LAST_ACTIVITY_KEY, String(now));

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        void logout();
      }, IDLE_TIMEOUT);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ] as const;

    events.forEach((event) => {
      window.addEventListener(event, resetTimer, {
        passive: true,
      });
    });

    // Periksa waktu aktivitas sebelumnya ketika dashboard dibuka.
    const lastActivity = Number(
      localStorage.getItem(LAST_ACTIVITY_KEY)
    );

    if (
      !lastActivity ||
      Date.now() - lastActivity >= IDLE_TIMEOUT
    ) {
      void logout();
    } else {
      resetTimer();
    }

    return () => {
      active = false;
      clearTimeout(timeoutId);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [pathname]);

  return null;
}
