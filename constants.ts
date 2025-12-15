// Target: 2026-01-01 00:00:00 Beijing Time (UTC+8)
// We set the target as an ISO string with offset to ensure browser consistency
export const TARGET_DATE_ISO = "2026-01-01T00:00:00+08:00";

// API for network time (fallback to local if fails)
export const TIME_API_URL = "https://worldtimeapi.org/api/timezone/Asia/Shanghai";

export const CRITICAL_THRESHOLD_SECONDS = 10;
