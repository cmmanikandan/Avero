/**
 * Dynamic Flash Sales & Live Countdown Drops Engine
 * Manages active lightning deals, claim velocity meters, countdown timers & upcoming drops
 */
export const FLASH_DROPS_SCHEDULE = [];

/**
 * Calculates countdown remaining time object { hours, minutes, seconds, isExpired }
 */
export function getCountdownTimeRemaining(targetIsoDate) {
  if (!targetIsoDate) {
    return { hours: '00', minutes: '00', seconds: '00', totalSeconds: 0, isExpired: true };
  }
  const total = Date.parse(targetIsoDate) - Date.now();
  if (total <= 0) {
    return { hours: '00', minutes: '00', seconds: '00', totalSeconds: 0, isExpired: true };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)));

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    totalSeconds: Math.floor(total / 1000),
    isExpired: false
  };
}

/**
 * Gets currently active live flash deals
 */
export function getActiveLiveFlashDeals() {
  const liveSlot = FLASH_DROPS_SCHEDULE.find(s => s.status === 'LIVE_NOW') || FLASH_DROPS_SCHEDULE[0] || null;
  return {
    slot: liveSlot,
    deals: liveSlot?.deals || []
  };
}
