export interface Point {
  x: number;
  y: number;
}

export interface DrawStyle {
  color: string;
  lineWidth: number;
}

export enum AppMode {
  DRAW = 'DRAW',
  ANALYZING = 'ANALYZING',
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export const COLORS = [
  { name: 'Neon Pink', value: '#ff00ff' },
  { name: 'Cyan', value: '#00ffff' },
  { name: 'Lime Green', value: '#39ff14' },
  { name: 'Bright Yellow', value: '#ffff00' },
  { name: 'Orange', value: '#ffaa00' },
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' }, // Eraser effectively
];

export const BRUSH_SIZES = [4, 8, 12, 20];
