"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  MAINTENANCE_AUTO_DETECTION_ENABLED,
  MAINTENANCE_HEALTHCHECK_INTERVAL_MS,
  MAINTENANCE_HEALTHCHECK_TIMEOUT_MS,
  MAINTENANCE_MODE_FORCE_ENABLED,
  ROUTEMISR_API_BASE_URL,
} from "@/config/maintenance";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setHealthcheckDown } from "@/store/maintenanceSlice";

export default function MaintenanceGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isApiDown, isHealthcheckDown } = useAppSelector(
    (state) => state.maintenance,
  );

  const isMaintenanceActive =
    MAINTENANCE_MODE_FORCE_ENABLED ||
    (MAINTENANCE_AUTO_DETECTION_ENABLED && (isApiDown || isHealthcheckDown));
  const isAuthApiPath = pathname.startsWith("/api/auth/");
  const isAnyApiPath = pathname.startsWith("/api/");

  useEffect(() => {
    // Never redirect API endpoints to the maintenance page (NextAuth expects JSON).
    if (isAuthApiPath || isAnyApiPath) {
      return;
    }

    if (isMaintenanceActive && pathname !== "/maintenance") {
      router.replace("/maintenance");
    }
  }, [isAnyApiPath, isAuthApiPath, isMaintenanceActive, pathname, router]);

  useEffect(() => {
    if (!MAINTENANCE_AUTO_DETECTION_ENABLED || MAINTENANCE_MODE_FORCE_ENABLED) {
      return;
    }

    let isMounted = true;

    const runHealthcheck = async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, MAINTENANCE_HEALTHCHECK_TIMEOUT_MS);

      try {
        const response = await fetch(
          `${ROUTEMISR_API_BASE_URL}/products?limit=1`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!isMounted) {
          return;
        }

        dispatch(setHealthcheckDown(response.status >= 500));
      } catch {
        if (isMounted) {
          dispatch(setHealthcheckDown(true));
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    void runHealthcheck();

    const intervalId = window.setInterval(() => {
      void runHealthcheck();
    }, MAINTENANCE_HEALTHCHECK_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [dispatch]);

  return null;
}
