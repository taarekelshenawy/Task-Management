export function TotalFromContentRange(contentRange = '') {
  return Number(contentRange.split('/')[1] || 0);
}