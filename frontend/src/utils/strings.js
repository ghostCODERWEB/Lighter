// src/utils/strings.js
export const sym = (s, marketIndex) => s || (marketIndex != null ? `M${marketIndex}` : "—");
