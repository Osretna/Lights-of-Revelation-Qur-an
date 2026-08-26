// Security & Anti-Tampering Utilities

/**
 * Sanitize untrusted user input string to prevent XSS and HTML injection
 */
export function sanitizeInput(input: string, maxLength = 1000): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // strip raw HTML tags
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');
}

/**
 * Validate and safely parse JSON
 */
export function safeJsonParse<T>(data: string, fallback: T): T {
  try {
    return JSON.parse(data) as T;
  } catch (err) {
    console.warn('Safe JSON parse caught corrupted input:', err);
    return fallback;
  }
}

/**
 * Security audit & defensive environment checker
 */
export function initSecurityDefenses() {
  if (typeof window === 'undefined') return;

  // Prevent prototype pollution on critical object properties
  try {
    Object.freeze(Object.prototype);
  } catch {}

  // Global uncaught error listener to prevent silent app crashes
  window.addEventListener('error', (event) => {
    if (event.message?.includes('ResizeObserver') || event.message?.includes('Script error')) {
      return; // Ignore non-critical benign browser events
    }
    console.warn('Caught defended runtime event:', event.message);
  });
}
