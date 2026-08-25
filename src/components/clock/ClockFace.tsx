import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

type Props = {
  hour: number;
  size?: number;
  faceColor?: string;
};

export default function ClockFace({ hour, size = 64, faceColor = '#FFFFFF' }: Props) {
  const ticks = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Circle cx={40} cy={40} r={36} fill={faceColor} stroke="#2E2A4A" strokeWidth={3} />
      {ticks.map((i) => (
        <Line
          key={i}
          x1={40}
          y1={7}
          x2={40}
          y2={i % 3 === 0 ? 13 : 11}
          stroke="#2E2A4A"
          strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
          opacity={0.7}
          rotation={i * 30}
          origin="40,40"
        />
      ))}
      <Line x1={40} y1={40} x2={40} y2={20} stroke="#2E2A4A" strokeWidth={4.5} strokeLinecap="round" rotation={hour * 30} origin="40,40" />
      <Line x1={40} y1={40} x2={40} y2={11} stroke="#5AA9E6" strokeWidth={2.5} strokeLinecap="round" rotation={0} origin="40,40" />
      <Circle cx={40} cy={40} r={3.2} fill="#2E2A4A" />
    </Svg>
  );
}
