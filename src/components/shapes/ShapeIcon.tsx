import React from 'react';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { ShapeType } from '../../data/shapesData';

type Props = {
  type: ShapeType;
  size?: number;
  color?: string;
};

function starPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

function polygonPoints(cx: number, cy: number, r: number, sides: number): string {
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

export default function ShapeIcon({ type, size = 56, color = '#8B7CF6' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {type === 'circle' && <Circle cx={40} cy={40} r={34} fill={color} />}
      {type === 'square' && <Rect x={8} y={8} width={64} height={64} rx={8} fill={color} />}
      {type === 'rectangle' && <Rect x={4} y={20} width={72} height={40} rx={8} fill={color} />}
      {type === 'triangle' && <Polygon points="40,6 76,72 4,72" fill={color} />}
      {type === 'star' && <Polygon points={starPoints(40, 40, 34, 14)} fill={color} />}
      {type === 'pentagon' && <Polygon points={polygonPoints(40, 40, 34, 5)} fill={color} />}
    </Svg>
  );
}
