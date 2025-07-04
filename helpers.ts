
import type { UsageHistory, ProcessedSession } from './types.ts';

export const parseDataSize = (sizeStr: string): number => {
  if (!sizeStr || typeof sizeStr !== 'string') return 0;
  const cleanedStr = sizeStr.replace(/,/g, '').trim().toLowerCase();
  const parts = cleanedStr.match(/^([\d.]+)\s*(\w*)\.?$/);
  if (!parts) return 0;

  const value = parseFloat(parts[1]);
  const unit = parts[2];

  switch (unit) {
    case 'gb':
      return value * 1024;
    case 'mb':
      return value;
    case 'kb':
      return value / 1024;
    default:
      return 0;
  }
};

export const parseSessionDuration = (durationStr: string): number => {
    if (!durationStr) return 0;
    const parts = durationStr.split(':').map(Number);
    if (parts.length !== 3) return 0;
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
};

export const formatDataSize = (mb: number): string => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`;
  }
  if (mb < 1 && mb > 0) {
    return `${(mb * 1024).toFixed(2)} KB`;
  }
  return `${mb.toFixed(2)} MB`;
};

export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds < 0) return '0s';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  if (seconds > 0 || result === '') result += `${seconds}s`;
  
  return result.trim();
};

export const getSessionTags = (session: Omit<ProcessedSession, 'tags'>): string[] => {
    const tags: string[] = [];
    const { uploadMB, downloadMB, totalMB, durationSeconds, endDate } = session;

    if (downloadMB > 1024) {
        tags.push('Heavy Download');
    }
    if (uploadMB > 512) {
        tags.push('Heavy Upload');
    }

    // Apply duration-based tags only to completed sessions
    if (endDate !== null) {
        if (durationSeconds > 3 * 3600) {
            tags.push('Long Session');
        }
        if (durationSeconds > 0 && durationSeconds < 60) {
            tags.push('Short Session');
        }
        if (totalMB < 1 && durationSeconds > 600) {
            tags.push('Idle');
        }
    }

    return tags;
}

export const processUsageHistory = (usageHistory: UsageHistory[]): ProcessedSession[] => {
  return usageHistory
    .map(session => {
        try {
            const startDate = new Date(session.connectionDate);
            // Handle active session case where data might be zero but connection is live
            const isActiveSession = !session.disconnectionDate && session.download === "0 KB." && session.upload === "0 KB.";
            const endDate = session.disconnectionDate ? new Date(session.disconnectionDate) : null;
            
            const uploadMB = parseDataSize(session.upload);
            const downloadMB = parseDataSize(session.download);

            // For active sessions with no data yet, duration is calculated live in the component.
            // For historical data, parse from sessionTime.
            const durationSeconds = endDate 
                ? parseSessionDuration(session.sessionTime) 
                : (isActiveSession ? 0 : (new Date().getTime() - startDate.getTime()) / 1000);

            const processed = {
                startDate,
                endDate,
                uploadMB,
                downloadMB,
                totalMB: uploadMB + downloadMB,
                durationSeconds,
            };
            
            return {
                ...processed,
                tags: getSessionTags(processed),
            }

        } catch(e) {
            console.error("Failed to parse session:", session, e);
            return null;
        }
    })
    .filter((s): s is ProcessedSession => s !== null && !isNaN(s.startDate.getTime()))
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
};

export const getDaysLeft = (expiryDateStr: string): number => {
    try {
        const expiryDate = new Date(expiryDateStr.replace(/-/g, ' '));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = expiryDate.getTime() - today.getTime();
        if (diffTime < 0) return 0;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
        return 0;
    }
};
