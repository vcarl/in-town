// Build-configurable settings
// Override these via environment variables or build configuration

export const config = {
  // Base URL for external links (privacy policy, terms, etc.)
  baseUrl: process.env.EXPO_PUBLIC_BASE_URL || "https://example.com",

  // Privacy policy path
  privacyPolicyPath: "/privacy",

  // Homepage path
  homepagePath: '/',

  // Get full privacy policy URL
  get privacyPolicyUrl() {
    return `${this.baseUrl}${this.privacyPolicyPath}`;
  },

  // Get full homepage URL
  get homepageUrl() {
    return this.baseUrl;
  },
};
