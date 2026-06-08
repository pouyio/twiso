export const LEGEND = [
  { color: '#1DA1F2', min: 9.5 },
  { color: '#186A3B', min: 9.0 },
  { color: '#28B463', min: 8.0 },
  { color: '#F4D03F', min: 7.0 },
  { color: '#F39C12', min: 6.0 },
  { color: '#E74C3C', min: 5.0 },
  { color: '#633974', min: 0 },
];

const DARK_COLORS = new Set(['#1DA1F2', '#186A3B', '#633974']);
export const GRAY = 'rgb(189, 189, 189)';

export function getColor(vote?: number): string {
  if (vote === undefined) return GRAY;
  for (const item of LEGEND) {
    if (vote >= item.min) return item.color;
  }
  return LEGEND[LEGEND.length - 1].color;
}

export function textFill(color: string): string {
  return DARK_COLORS.has(color) ? '#ffffff' : '#2a2a2a';
}

export function formatVote(vote?: number): string {
  if (vote === undefined) return '?';
  return vote.toFixed(1);
}
