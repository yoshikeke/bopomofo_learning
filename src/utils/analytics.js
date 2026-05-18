// GA4 custom event helper
// Usage: trackEvent('convert_text', { input_mode: 'text' })
export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}
