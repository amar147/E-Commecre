export const ROUTEMISR_API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

// Manual emergency toggle. Keep false for normal operation.
export const MAINTENANCE_MODE_FORCE_ENABLED = false;

// Automatic maintenance mode based on API health checks and RTK Query failures.
export const MAINTENANCE_AUTO_DETECTION_ENABLED = true;
export const MAINTENANCE_FAILURE_THRESHOLD = 3;
export const MAINTENANCE_HEALTHCHECK_INTERVAL_MS = 30000;
export const MAINTENANCE_HEALTHCHECK_TIMEOUT_MS = 6000;
