import { useState, useEffect } from 'react';

/**
 * Universal Network Quality Analyzer
 * Uses the Network Information API to adapt rendering, particle budgets,
 * and media buffering to the visitor's real-time connection speed.
 */
export function getNetworkQuality() {
  if (typeof navigator === 'undefined') {
    return {
      isSlow: false,
      isSaveData: false,
      effectiveType: '4g',
      downlink: 10,
      rtt: 50,
      videoPreload: 'metadata',
      particleBudget: 120,
      canvasDpr: 1.5,
      loadingDuration: 1800,
      enableHeavyFx: true,
    };
  }

  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  const isSaveData = Boolean(conn?.saveData);
  const effectiveType = conn?.effectiveType || '4g';
  const downlink = typeof conn?.downlink === 'number' ? conn.downlink : 10;
  const rtt = typeof conn?.rtt === 'number' ? conn.rtt : 50;

  // Connection is classified as slow if on 2G/3G, Data Saver is ON, or downlink < 1.0 Mbps
  const isSlow =
    isSaveData ||
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    effectiveType === '3g' ||
    downlink < 1.0 ||
    rtt > 600;

  return {
    isSlow,
    isSaveData,
    effectiveType,
    downlink,
    rtt,
    videoPreload: isSlow ? 'none' : 'metadata',
    particleBudget: isSlow ? 55 : 125,
    canvasDpr: isSlow ? 1.0 : 1.5,
    loadingDuration: isSlow ? 2800 : 1800,
    enableHeavyFx: !isSlow,
  };
}

export default function useNetworkQuality() {
  const [quality, setQuality] = useState(getNetworkQuality);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (!conn || !conn.addEventListener) return;

    const handleChange = () => {
      setQuality(getNetworkQuality());
    };

    conn.addEventListener('change', handleChange);
    return () => conn.removeEventListener('change', handleChange);
  }, []);

  return quality;
}
