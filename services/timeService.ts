import { TIME_API_URL } from '../constants';

/**
 * Returns the difference in milliseconds between Server Time and Local Time.
 * A positive value means Server is ahead of Local.
 */
export const getNetworkTimeOffset = async (): Promise<number> => {
  try {
    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const response = await fetch(TIME_API_URL, { signal: controller.signal });
    const end = Date.now();
    
    if (!response.ok) {
      throw new Error('Network time fetch failed');
    }

    const data = await response.json();
    const serverTime = data.unixtime * 1000;
    
    // Account for latency (rough approximation: half of round trip time)
    const latency = (end - start) / 2;
    const estimatedServerTime = serverTime + latency;

    const offset = estimatedServerTime - end;
    console.log(`Time synchronized. Offset: ${offset}ms`);
    return offset;

  } catch (error) {
    console.warn("Could not fetch network time, falling back to system time.", error);
    return 0;
  }
};
