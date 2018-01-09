/**
 * Safely fire GA Event
 * See: https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 * @param {String} category
 * @param {String} action
 * @param {String} label
 */
export default function sendEvent(category, action, label) {
    if (window.ga) {
        window.ga('send', 'event', category, action, label);
    } else {
        console.warn("Google Analytics not detected on page. Might be blocked?");
    }
}